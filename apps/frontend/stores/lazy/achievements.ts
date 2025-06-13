import sortBy from 'lodash/sortBy';

import { forceAddonCriteria, forceGarrisonTalent } from '@/data/achievements';
import { CriteriaType } from '@/enums/criteria-type';
import { Faction } from '@/enums/faction';
import { CriteriaTreeOperator } from '@/enums/wow';
import { UserCount } from '@/types';
import type { AchievementsState } from '../local-storage';
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCategory,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    Character,
    UserAchievementData,
    UserData,
} from '@/types';
import type { UserQuestData } from '@/types/data';

interface LazyStores {
    achievementState: AchievementsState;
    achievementData: AchievementData;
    userAchievementData: UserAchievementData;
    userData: UserData;
    userQuestData: UserQuestData;
}

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

export function doAchievements(stores: LazyStores): LazyAchievements {
    console.time('doAchievements');

    const processor = new AchievementProcessor(stores);
    return processor.process();
}

class AchievementProcessor {
    private stores: LazyStores;

    private data: LazyAchievements = new LazyAchievements();
    private allianceCharacters: Character[];
    private hordeCharacters: Character[];
    private overallPoints: UserCount;
    private overallStats: UserCount;

    constructor(stores: LazyStores) {
        this.stores = stores;
    }

    process(): LazyAchievements {
        console.time('AchievementProcessor.process');

        this.allianceCharacters = this.stores.userData.characters.filter(
            (char) => char.faction === Faction.Alliance
        );
        this.hordeCharacters = this.stores.userData.characters.filter(
            (char) => char.faction === Faction.Horde
        );

        this.overallPoints = this.data.points['OVERALL'] = new UserCount();
        this.overallStats = this.data.stats['OVERALL'] = new UserCount();

        for (const category of this.stores.achievementData.categories.filter((cat) => !!cat)) {
            this.processCategory(category);

            for (const childCategory of category.children) {
                this.processCategory(childCategory, category);
            }
        }

        console.timeEnd('AchievementProcessor.process');
        console.log(this.data);
        return this.data;
    }

    private processCategory(
        dataCategory: AchievementDataCategory,
        parent?: AchievementDataCategory
    ) {
        if (!dataCategory) {
            return;
        }

        const { achievementData, userAchievementData, userData } = this.stores;

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
            const achievement = this.stores.achievementData.achievement[achievementId];
            if (!achievement) {
                console.warn('Invalid achievement id:', achievementId);
                continue;
            }

            const computedAchievement = new ComputedAchievement(achievementId, achievement);
            category.achievements.push(computedAchievement);

            computedAchievement.earned =
                userAchievementData.achievements[achievementId] !== undefined;

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
            this.stores.achievementData.criteriaTree[achievementData.achievement.criteriaTreeId];
        if (!rootCriteriaTree) {
            return;
        }

        achievementData.criteria = this.recurseCriteriaTree(achievementData, rootCriteriaTree);
    }

    private recurseCriteriaTree(
        achievementData: ComputedAchievement,
        criteriaTree: AchievementDataCriteriaTree
    ): ComputedCriteria {
        const criteria = this.stores.achievementData.criteria[criteriaTree.criteriaId];
        const criteriaData = new ComputedCriteria(criteriaTree, criteria);

        // continue downwards before processing this node
        for (const childTreeId of criteriaTree.children || []) {
            const childTree = this.stores.achievementData.criteriaTree[childTreeId];
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
        const { achievementData, userAchievementData, userData, userQuestData } = this.stores;
        const { achievement } = computedAchievement;
        const { criteria, criteriaTree } = computedCriteria;

        const characters = userData.characters.filter(
            (char) =>
                (achievement.faction === 0 && char.faction === 1) ||
                (achievement.faction === 1 && char.faction === 0) ||
                achievement.faction === -1
        );

        const data = computedAchievement.characters[computedCriteria.criteriaTree.id];

        let checkCriteria = false;
        if (criteria?.type === CriteriaType.EarnAchievement) {
            computedCriteria.have =
                userAchievementData.achievements[criteria.asset] !== undefined ? 1 : 0;
        } else if (
            criteria?.type === CriteriaType.GarrisonTalentCompleteResearchAny &&
            forceGarrisonTalent[criteriaTree.id]
        ) {
            const [talentId, minRank] = forceGarrisonTalent[criteriaTree.id];
            for (const character of userData.characters) {
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
            computedCriteria.have = Object.values(userQuestData.characters).filter((char) =>
                char.quests?.has(criteria.asset)
            ).length;

            // Fall back to criteria lookup
            // if (ret.have[criteriaTree.id] === 0) {
            //     checkCriteria = true;
            // }
        } else if (criteria?.type === CriteriaType.RaiseSkillLine) {
            for (const character of userData.characters) {
                for (const profession of Object.values(character.professions || {})) {
                    const subProfession = profession.subProfessions[criteria.asset];
                    if (subProfession?.skillCurrent >= criteriaTree.amount) {
                        computedCriteria.have = subProfession.skillMax;
                        break;
                    }
                }
            }
        } else if (criteria?.type === CriteriaType.ReputationGained) {
            computedCriteria.have = Math.max(
                ...userData.characters.map((char) => char.reputations?.[criteria.asset] || 0)
            );
        } else if (criteria?.type === CriteriaType.HonorMaybe) {
            console.log('honor?', computedCriteria);
            computedCriteria.have = userData.honorLevel || 0;
        } else {
            checkCriteria = true;
        }

        if (checkCriteria) {
            const value: number[] = (userAchievementData.criteria[criteriaTree.id] || [[]])[0];
            computedCriteria.have = value[1] || 0;

            // if (ret.have[childId] === 0) {
            //     // console.log(childId, childTree);
            //     for (const childChild of childTree.children) {
            //         const value: number[] = (userAchievementData.criteria[childChild] || [[]])[0];
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
    userAchievementData: UserAchievementData,
    userData: UserData,
    userQuestData: UserQuestData,
    achievement: AchievementDataAchievement
): AchievementDataAccount {
    //const ctMap = get(achievementStore).criteriaTree
    //const userCrits = get(userAchievementStore).criteria

    const ret = new AchievementDataAccount();

    const characterCounts: Record<number, number> = {};
    const characters = userData.characters.filter(
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

        for (const characterAchievements of Object.values(userAchievementData.addonAchievements)) {
            const characterAchievement = characterAchievements[forcedId];
            if (characterAchievement) {
                for (
                    let criteriaIndex = 0;
                    criteriaIndex < characterAchievement.criteria.length;
                    criteriaIndex++
                ) {
                    ret.have[rootCriteriaTree.id] = characterAchievement.criteria[criteriaIndex];
                }

                break;
            }
        }

        //console.log(achievement.id, forcedId, userAchievementData.addonAchievements)
        //console.log(userAchievementData.addonAchievements[forcedId])
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
                    userAchievementData.criteria[childId]
                );
            }

            let checkCriteria = false;

            if (criteria?.type === CriteriaType.EarnAchievement) {
                ret.have[childId] =
                    userAchievementData.achievements[criteria.asset] !== undefined ? 1 : 0;
            } else if (
                criteria?.type === CriteriaType.GarrisonTalentCompleteResearchAny &&
                forceGarrisonTalent[childId]
            ) {
                const [talentId, minRank] = forceGarrisonTalent[childId];
                for (const character of userData.characters) {
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
                ret.have[childId] = Object.values(userQuestData.characters).filter((char) =>
                    char.quests?.has(criteria.asset)
                ).length;

                // Fall back to criteria lookup
                if (ret.have[childId] === 0) {
                    checkCriteria = true;
                }
            } else if (criteria?.type === CriteriaType.RaiseSkillLine) {
                for (const character of userData.characters) {
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
                    ...userData.characters.map((char) => char.reputations?.[criteria.asset] || 0)
                );
            } else if (criteria?.type === CriteriaType.HonorMaybe) {
                console.log(criteria);
                console.log(childTree);
                ret.have[childId] = userData.honorLevel || 0;
            } else {
                checkCriteria = true;
            }

            if (checkCriteria) {
                const value: number[] = (userAchievementData.criteria[childId] || [[]])[0];
                ret.have[childId] = value[1] || 0;

                if (ret.have[childId] === 0) {
                    // console.log(childId, childTree);
                    for (const childChild of childTree.children) {
                        const value: number[] = (userAchievementData.criteria[childChild] || [
                            [],
                        ])[0];
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

export class AchievementDataAccount {
    characters: [number, number][] = [];
    criteria: AchievementDataCriteriaTree[] = [];
    have: Record<number, number> = {};
    total: number = 0;
}
