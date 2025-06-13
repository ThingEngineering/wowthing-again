import sortBy from 'lodash/sortBy';

import { forceAddonCriteria, forceGarrisonTalent } from '@/data/achievements';
import { CriteriaType } from '@/enums/criteria-type';
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData,
} from '@/types';
import type { UserQuestData } from '@/types/data';
import { CriteriaTreeOperator } from '@/enums/wow';
import { userState } from '@/user-home/state/user';

const debugId = 40882;

export function getAccountData(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    userQuestData: UserQuestData,
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
                ret.have[childId] = Object.values(userQuestData.characters).filter((char) =>
                    char.quests?.has(criteria.asset)
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
