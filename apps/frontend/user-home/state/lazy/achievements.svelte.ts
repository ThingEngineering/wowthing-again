import sortBy from 'lodash/sortBy';
import { get } from 'svelte/store';

import { forceAddonCriteria, forceGarrisonTalent } from '@/data/achievements';
import { CriteriaType } from '@/enums/criteria-type';
import { Faction } from '@/enums/faction';
import { CriteriaTreeOperator } from '@/enums/wow';
import { UserCount } from '@/types';
import {
    type AchievementData,
    type AchievementDataAchievement,
    type AchievementDataCategory,
    type AchievementDataCriteria,
    type AchievementDataCriteriaTree,
    type Character,
} from '@/types';
import { userState } from '../user';
import { achievementStore } from '@/stores';

export class LazyAchievements {
    public achievements: Record<number, ComputedAchievement> = {};
    public categories: Record<number, ComputedCategory> = {};
    public points: Record<string, UserCount> = {};
    public stats: Record<string, UserCount> = {};
}

export class ComputedCategory {
    public achievements: ComputedAchievement[] = [];

    constructor(public category: AchievementDataCategory) {}
}

export class ComputedAchievement {
    public characters: Record<number, [number, number][]> = {};
    public criteria: ComputedCriteria;
    public earned: boolean;

    constructor(
        public achievementId: number,
        public achievement: AchievementDataAchievement
    ) {}
}

export class ComputedCriteria {
    public earned: boolean;
    public have: number;
    public linkId: number;
    public linkType: string; // TODO enum
    public children: ComputedCriteria[] = [];

    constructor(
        public criteriaTree: AchievementDataCriteriaTree,
        public criteria: AchievementDataCriteria
    ) {}
}

export class AchievementDataAccount {
    characters: [number, number][] = [];
    criteria: AchievementDataCriteriaTree[] = [];
    have: Record<number, number> = {};
    total: number = 0;
}

export function doAchievements(): LazyAchievements {
    console.time('doAchievements');

    const processor = new AchievementProcessor();
    const result = processor.process();

    console.timeEnd('doAchievements');
    return result;
}

class AchievementProcessor {
    private data: LazyAchievements = new LazyAchievements();
    private allianceCharacters: Character[];
    private hordeCharacters: Character[];
    private overallPoints: UserCount;
    private overallStats: UserCount;

    private achievementData: AchievementData;

    constructor() {
        // FIXME: move to wowthingData
        this.achievementData = get(achievementStore);
    }

    process(): LazyAchievements {
        console.time('AchievementProcessor.process');

        this.allianceCharacters = userState.general.characters.filter(
            (char) => char.faction === Faction.Alliance
        );
        this.hordeCharacters = userState.general.characters.filter(
            (char) => char.faction === Faction.Horde
        );

        this.overallPoints = this.data.points['OVERALL'] = new UserCount();
        this.overallStats = this.data.stats['OVERALL'] = new UserCount();

        for (const category of this.achievementData.categories.filter((cat) => !!cat)) {
            this.processCategory(category);

            for (const childCategory of category.children) {
                this.processCategory(childCategory, category);
            }
        }

        console.timeEnd('AchievementProcessor.process');
        // console.log(this.data);
        return this.data;
    }

    private processCategory(
        dataCategory: AchievementDataCategory,
        parent?: AchievementDataCategory
    ) {
        if (!dataCategory) {
            return;
        }

        const category = (this.data.categories[dataCategory.id] = new ComputedCategory(
            dataCategory
        ));

        const catKey = parent ? `${parent.slug}--${dataCategory.slug}` : dataCategory.slug;
        const catPoints = (this.data.points[catKey] = new UserCount());
        const catStats = (this.data.stats[catKey] = new UserCount());

        const allIds: number[] = [];
        for (const thing of dataCategory.achievementIds) {
            if (Array.isArray(thing)) {
                allIds.push(...thing);
            } else {
                allIds.push(thing);
            }
        }

        for (const achievementId of allIds) {
            const achievement = this.achievementData.achievement[achievementId];
            if (!achievement) {
                console.warn('Invalid achievement id:', achievementId);
                continue;
            }

            const computedAchievement = new ComputedAchievement(achievementId, achievement);
            category.achievements.push(computedAchievement);

            computedAchievement.earned =
                userState.achievements.achievementEarnedById.has(achievementId);

            catPoints.total += achievement.points;
            catStats.total++;

            if (computedAchievement.earned) {
                catPoints.have += achievement.points;
                catStats.have++;
            }

            this.processAchievementCriteria(computedAchievement);

            if (!computedAchievement.earned) console.log(computedAchievement);

            // console.log(dataAchievement, rootCriteriaTree);

            // data = getAccountData(
            //     $achievementStore,
            //     $userAchievementStore,
            //     $userStore,
            //     achievement,
            // );

            // progressBar = achievement?.isProgressBar || data.criteria[0]?.isProgressBar || false;
        }
    }

    // Depth-first traversal of criteria trees, we need to know the state of the children to
    // calculate the state of the parent
    private processAchievementCriteria(achievementData: ComputedAchievement) {
        const rootCriteriaTree =
            this.achievementData.criteriaTree[achievementData.achievement.criteriaTreeId];
        if (!rootCriteriaTree) {
            return;
        }

        achievementData.criteria = this.recurseCriteriaTree(achievementData, rootCriteriaTree);
    }

    private recurseCriteriaTree(
        achievementData: ComputedAchievement,
        criteriaTree: AchievementDataCriteriaTree
    ): ComputedCriteria {
        const criteria = this.achievementData.criteria[criteriaTree.criteriaId];
        const criteriaData = new ComputedCriteria(criteriaTree, criteria);

        // continue downwards before processing this node
        for (const childTreeId of criteriaTree.children || []) {
            const childTree = this.achievementData.criteriaTree[childTreeId];
            if (childTree) {
                criteriaData.children.push(this.recurseCriteriaTree(achievementData, childTree));
            }
        }

        if (achievementData.achievement.isAccountWide) {
            this.criteriaAccount(achievementData, criteriaData);
        } else {
            // console.log('NO PER CHARACTER', achievementData.achievementId);
        }

        return criteriaData;
    }

    private criteriaAccount(
        computedAchievement: ComputedAchievement,
        computedCriteria: ComputedCriteria
    ) {
        const { achievement } = computedAchievement;
        const { criteria, criteriaTree } = computedCriteria;

        const characters = userState.general.characters.filter(
            (char) =>
                (achievement.faction === 0 && char.faction === 1) ||
                (achievement.faction === 1 && char.faction === 0) ||
                achievement.faction === -1
        );

        const data = computedAchievement.characters[computedCriteria.criteriaTree.id];

        let checkCriteria = false;
        if (criteria?.type === CriteriaType.EarnAchievement) {
            computedCriteria.have = userState.achievements.achievementEarnedById.has(criteria.asset)
                ? 1
                : 0;
        } else if (
            criteria?.type === CriteriaType.GarrisonTalentCompleteResearchAny &&
            forceGarrisonTalent[criteriaTree.id]
        ) {
            const [talentId, minRank] = forceGarrisonTalent[criteriaTree.id];
            for (const character of userState.general.characters) {
                for (const garrisonTree of Object.values(character.garrisonTrees || {})) {
                    if (garrisonTree[talentId]) {
                        const talentRank = garrisonTree[talentId]?.[0] || 0;
                        if (talentRank >= minRank) {
                            computedCriteria.have = talentRank;
                        }
                        break;
                    }
                }
            }
        } else if (criteria?.type === CriteriaType.CompleteQuest) {
            computedCriteria.have = Array.from(userState.quests.characterById.values()).filter(
                (char) => char.hasQuestById.has(criteria.asset)
            ).length;

            // Fall back to criteria lookup
            // if (ret.have[criteriaTree.id] === 0) {
            //     checkCriteria = true;
            // }
        } else if (criteria?.type === CriteriaType.RaiseSkillLine) {
            for (const character of userState.general.characters) {
                for (const profession of Object.values(character.professions || {})) {
                    const subProfession = profession.subProfessions[criteria.asset];
                    if (subProfession?.skillCurrent >= criteriaTree.amount) {
                        computedCriteria.have = subProfession.skillCurrent;
                        break;
                    }
                }
            }
        } else if (criteria?.type === CriteriaType.ReputationGained) {
            computedCriteria.have = Math.max(
                ...userState.general.characters.map(
                    (char) => char.reputations?.[criteria.asset] || 0
                )
            );
        } else if (criteria?.type === CriteriaType.HonorMaybe) {
            console.log('honor?', computedCriteria);
            computedCriteria.have = userState.general.honorLevel || 0;
        } else {
            checkCriteria = true;
        }

        if (checkCriteria) {
            const value: number[] = (userState.achievements.criteriaById.get(criteriaTree.id) || [
                [],
            ])[0];
            computedCriteria.have = value[1] || 0;

            // if (ret.have[childId] === 0) {
            //     // console.log(childId, childTree);
            //     for (const childChild of childTree.children) {
            //         const value: number[] = (userState.achievements.criteria[childChild] || [[]])[0];
            //         ret.have[childId] += value[1] || 0;
            //         ret.have[childChild] = value[1] || 0;
            //     }
            // }
        }

        // Collect all?
        switch (criteriaTree.operator) {
            // Single

            // SingleNotCompleted

            case CriteriaTreeOperator.All:
                break;

            // SumChildren

            // MaxChild

            // CountDirectChildren

            // Count of children is > count?
            case CriteriaTreeOperator.Any:
                computedCriteria.have = computedCriteria.children.filter(
                    (child) => child.have >= child.criteriaTree.amount
                ).length;
                break;

            // SumChildrenWeight

            default:
                console.log('wtf?', CriteriaTreeOperator[criteriaTree.operator]);
        }
    }
}

const debugId = 40882;

export function getAccountData(
    achievementData: AchievementData,
    achievement: AchievementDataAchievement
): AchievementDataAccount {
    //const ctMap = get(achievementStore).criteriaTree
    //const userCrits = get(userAchievementStore).criteria

    const ret = new AchievementDataAccount();

    const characterCounts: Record<number, number> = {};
    const characters = userState.general.characters.filter(
        (char) =>
            (achievement.faction === 0 && char.faction === 1) ||
            (achievement.faction === 1 && char.faction === 0) ||
            achievement.faction === -1
    );
    // const characterIds = characters.map((char) => char.id);

    const rootCriteriaTree = achievementData.criteriaTree[achievement.criteriaTreeId];
    const forcedId = forceAddonCriteria[achievement.id];
    if (forcedId) {
        ret.criteria.push(rootCriteriaTree);

        // FIXME: addonAchievements
        // for (const characterAchievements of Object.values(
        //     userState.achievements.addonAchievements
        // )) {
        //     const characterAchievement = characterAchievements[forcedId];
        //     if (characterAchievement) {
        //         for (
        //             let criteriaIndex = 0;
        //             criteriaIndex < characterAchievement.criteria.length;
        //             criteriaIndex++
        //         ) {
        //             ret.have[rootCriteriaTree.id] = characterAchievement.criteria[criteriaIndex];
        //         }

        //         break;
        //     }
        // }

        //console.log(achievement.id, forcedId, userState.achievements.addonAchievements)
        //console.log(userState.achievements.addonAchievements[forcedId])
    } else {
        const children: number[] = [];
        const recurseChildren = (childId: number, addTrees = false) => {
            const childTree = achievementData.criteriaTree[childId];
            if (!childTree) {
                return;
            }

            if (
                // addStuff &&
                childTree.amount > 0 &&
                childTree.operator !== CriteriaTreeOperator.All &&
                childTree.operator !== CriteriaTreeOperator.Any /*&&
                parentCriteriaTree?.operator !== CriteriaTreeOperator.SumChildren*/
            ) {
                ret.total += childTree.amount;
            } else if (
                // addStuff &&
                childTree.id !== rootCriteriaTree.id &&
                rootCriteriaTree.operator === CriteriaTreeOperator.All
            ) {
                ret.total += Math.max(1, childTree.amount);
            }

            if (addTrees) {
                ret.criteria.push(childTree);
            }

            children.push(childId);
            for (const childChildId of childTree.children) {
                recurseChildren(childChildId);
            }
        };

        for (const childId of rootCriteriaTree?.children ?? []) {
            recurseChildren(childId, true);
        }

        for (const childId of children) {
            const childTree = achievementData.criteriaTree[childId];
            if (!childTree) {
                continue;
            }

            const criteria = achievementData.criteria[childTree.criteriaId];

            if (achievement.id === debugId) {
                console.log(
                    childTree,
                    achievementData.criteria[childTree.criteriaId],
                    userState.achievements.criteriaById.get(childId)
                );
            }

            let checkCriteria = false;

            if (criteria?.type === CriteriaType.EarnAchievement) {
                ret.have[childId] = userState.achievements.achievementEarnedById.has(criteria.asset)
                    ? 1
                    : 0;
            } else if (
                criteria?.type === CriteriaType.GarrisonTalentCompleteResearchAny &&
                forceGarrisonTalent[childId]
            ) {
                const [talentId, minRank] = forceGarrisonTalent[childId];
                for (const character of userState.general.characters) {
                    for (const garrisonTree of Object.values(character.garrisonTrees || {})) {
                        if (garrisonTree[talentId]) {
                            if (garrisonTree[talentId]?.[0] >= minRank) {
                                ret.have[childId] = 1;
                            }
                            break;
                        }
                    }
                }
            } else if (criteria?.type === CriteriaType.CompleteQuest) {
                ret.have[childId] = Array.from(userState.quests.characterById.values()).filter(
                    (char) => char.hasQuestById.has(criteria.asset)
                ).length;

                // Fall back to criteria lookup
                if (ret.have[childId] === 0) {
                    checkCriteria = true;
                }
            } else if (criteria?.type === CriteriaType.RaiseSkillLine) {
                for (const character of userState.general.characters) {
                    for (const profession of Object.values(character.professions || {})) {
                        const subProfession = profession.subProfessions[criteria.asset];
                        if (subProfession?.skillCurrent >= childTree.amount) {
                            ret.have[childId] = subProfession.skillCurrent;
                            break;
                        }
                    }
                }
            } else if (criteria?.type === CriteriaType.ReputationGained) {
                for (const character of characters) {
                    const reputation = character.reputations?.[criteria.asset] || 0;
                    if (reputation > 0) {
                        characterCounts[character.id] =
                            (characterCounts[character.id] || 0) + reputation;
                    }
                }

                ret.have[childId] = Math.max(
                    ...userState.general.characters.map(
                        (char) => char.reputations?.[criteria.asset] || 0
                    )
                );
            } else if (criteria?.type === CriteriaType.HonorMaybe) {
                console.log(criteria);
                console.log(childTree);
                ret.have[childId] = userState.general.honorLevel || 0;
            } else {
                checkCriteria = true;
            }

            if (checkCriteria) {
                const value: number[] = (userState.achievements.criteriaById.get(childId) || [
                    [],
                ])[0];
                ret.have[childId] = value[1] || 0;

                if (ret.have[childId] === 0) {
                    // console.log(childId, childTree);
                    for (const childChild of childTree.children) {
                        const value: number[] = (userState.achievements.criteriaById.get(
                            childChild
                        ) || [[]])[0];
                        ret.have[childId] += value[1] || 0;
                        ret.have[childChild] = value[1] || 0;
                    }
                }
            }
        }
    }

    ret.characters = sortBy(
        Object.entries(characterCounts).filter(([, count]) => count > 0),
        ([characterId, count]) => [10000000 - count, characterId]
    ).map(([characterId, count]) => [parseInt(characterId), count]);

    if (achievement.id === debugId) {
        console.log('ret', ret);
    }

    return ret;
}
