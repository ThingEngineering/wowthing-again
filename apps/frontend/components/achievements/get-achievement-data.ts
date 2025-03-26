import sortBy from 'lodash/sortBy';

import { addonAchievements } from '@/data/achievements';
import { CriteriaTreeOperator } from '@/enums/criteria-tree-operator';
import { CriteriaType } from '@/enums/criteria-type';
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData,
    UserData,
} from '@/types';
import type { UserQuestData } from '@/types/data';
import type { AchievementStatus } from './types';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

const debugId = 41095;

export function getAchievementStatus(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    userData: UserData,
    userQuestData: UserQuestData,
    achievement: AchievementDataAchievement,
): AchievementStatus {
    const ret: AchievementStatus = {
        characterCounts: [],
        criteriaCharacters: {},
        criteriaTrees: [],
        oneCriteria: false,
        reputation: false,
        rootCriteriaTree: achievementData.criteriaTree[achievement.criteriaTreeId],
        total: 0,
    };

    let leaves = 0;

    const characters = userData.characters.filter(
        (char) =>
            (achievement.faction === 0 && char.faction === 1) ||
            (achievement.faction === 1 && char.faction === 0) ||
            achievement.faction === -1,
    );
    const characterIds = new Set(characters.map((char) => char.id));

    function recurse(
        parentCriteriaTree: AchievementDataCriteriaTree,
        criteriaTree: AchievementDataCriteriaTree,
        addStuff = true,
        first = false,
    ) {
        if (!criteriaTree) {
            return;
        }

        if (criteriaTree.children.length === 0) {
            leaves++;
            if (leaves > 1) {
                ret.reputation = false;
            }
        }

        //const criteriaTree = achievementData.criteriaTree[criteriaTreeId]
        const criteria = achievementData.criteria[criteriaTree.criteriaId];
        const characterData = (ret.criteriaCharacters[criteriaTree.criteriaId || 0] ||= []);

        if (
            addStuff &&
            criteriaTree.amount > 0 &&
            criteriaTree.operator !== CriteriaTreeOperator.All &&
            criteriaTree.operator !== CriteriaTreeOperator.Any &&
            parentCriteriaTree?.operator !== CriteriaTreeOperator.SumChildren
        ) {
            ret.total += criteriaTree.amount;
        } else if (
            addStuff &&
            criteriaTree.id !== ret.rootCriteriaTree.id &&
            ret.rootCriteriaTree.operator === CriteriaTreeOperator.All
        ) {
            ret.total += Math.max(1, criteriaTree.amount);
        }

        if (!first) {
            ret.criteriaTrees.push([criteriaTree]);
        }

        if (achievement.id === debugId) {
            console.log('-', criteriaTree, criteriaTree.criteriaId, criteria, addStuff);
            // console.log('--', userAchievementData.criteria[criteriaTree.id] ?? []);
        }

        if (addonAchievements[achievement.id]) {
            for (const characterId in userAchievementData.addonAchievements) {
                const charData = userAchievementData.addonAchievements[characterId][achievement.id];
                characterData.push([parseInt(characterId), (charData?.criteria ?? [0])[0]]);
            }
        } else {
            if (criteria?.type === CriteriaType.CompleteQuest) {
                for (const character of characters) {
                    if (userQuestData.characters[character.id]?.quests?.has(criteria.asset)) {
                        characterData.push([character.id, 1]);
                    }
                }
            } else if (criteria?.type === CriteriaType.EarnAchievement) {
                if (userAchievementData.achievements[criteria.asset]) {
                    characterData.push([0, 1]);
                }
            } else if (criteria?.type === CriteriaType.RaiseSkillLine) {
                for (const character of characters) {
                    for (const subProfessions of Object.values(character.professions || {})) {
                        const subProfession = subProfessions[criteria.asset];
                        if (subProfession) {
                            console.log(character.id, character.name, subProfession);
                            characterData.push([character.id, subProfession.currentSkill]);

                            if (leaves === 1) {
                                ret.reputation = true;
                            }

                            break;
                        }
                    }
                }
            } else if (criteria?.type === CriteriaType.ReputationGained) {
                for (const character of characters) {
                    const reputation = character.reputations?.[criteria.asset] || 0;
                    if (reputation > 0) {
                        characterData.push([character.id, reputation]);
                    }
                }
            }

            if (characterData.length === 0) {
                for (const [characterId, count] of userAchievementData.criteria[criteriaTree.id] ??
                    []) {
                    if (!characterIds.has(characterId)) {
                        continue;
                    }

                    // if (achievement.id === debugId) {
                    //     console.log(
                    //         characterId,
                    //         userData.characterMap[characterId].name,
                    //         count,
                    //         addStuff,
                    //     );
                    // }

                    // && !(criteriaTree.id === rootCriteriaTree.id && criteriaTree.children.length > 0)
                    if (addStuff) {
                        characterData.push([
                            characterId,
                            parentCriteriaTree?.operator === CriteriaTreeOperator.SumChildren
                                ? count
                                : Math.min(Math.max(1, criteriaTree.amount), count),
                        ]);
                    }
                }
            }
        }

        if (parentCriteriaTree?.operator === CriteriaTreeOperator.SumChildren) {
            addStuff = false;
        }

        if (addStuff && criteriaTree.id !== ret.rootCriteriaTree.id && criteriaTree.amount > 0) {
            addStuff = false;
        }

        for (const criteriaTreeId of criteriaTree.children) {
            recurse(criteriaTree, achievementData.criteriaTree[criteriaTreeId], addStuff);
        }
    }

    recurse(null, ret.rootCriteriaTree, true, true);

    ret.reputation =
        ret.criteriaTrees.length === 1 &&
        ret.criteriaTrees[0].length === 1 &&
        achievementData.criteria[ret.criteriaTrees[0][0].criteriaId]?.type ===
            CriteriaType.ReputationGained;

    const characterCounts: Record<number, number> = {};
    for (const critData of Object.values(ret.criteriaCharacters)) {
        critData.sort((a, b) => 1000000 - a[1] - (1000000 - b[1]));

        for (const [characterId, amount] of critData) {
            characterCounts[characterId] = (characterCounts[characterId] || 0) + amount;
        }
    }

    ret.characterCounts = sortBy(
        getNumberKeyedEntries(characterCounts),
        ([, total]) => 1000000 - total,
    );

    ret.oneCriteria = leaves === 1;

    if (achievement.id === debugId) {
        console.log(ret);
    }

    return ret;
}
