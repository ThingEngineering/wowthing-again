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

const debugId = 14158;

export function getAchievementStatus(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    userData: UserData,
    userQuestData: UserQuestData,
    achievement: AchievementDataAchievement,
): AchievementStatus {
    const ret: AchievementStatus = {
        characters: [],
        criteriaTrees: [],
        rootCriteriaTree: achievementData.criteriaTree[achievement.criteriaTreeId],
        total: 0,
    };

    const characterCounts: Record<number, number> = {};

    const characters = userData.characters.filter(
        (char) =>
            (achievement.faction === 0 && char.faction === 1) ||
            (achievement.faction === 1 && char.faction === 0) ||
            achievement.faction === -1,
    );

    const characterIds = characters.map((char) => char.id);

    function recurse(
        parentCriteriaTree: AchievementDataCriteriaTree,
        criteriaTree: AchievementDataCriteriaTree,
        addStuff = true,
        first = false,
    ) {
        if (!criteriaTree) {
            return;
        }

        //const criteriaTree = achievementData.criteriaTree[criteriaTreeId]
        const criteria = achievementData.criteria[criteriaTree.criteriaId];

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
            console.log('--', userAchievementData.criteria[criteriaTree.id] ?? []);
        }

        if (addonAchievements[achievement.id]) {
            for (const characterId in userAchievementData.addonAchievements) {
                const charData = userAchievementData.addonAchievements[characterId][achievement.id];
                characterCounts[characterId] = (charData?.criteria ?? [0])[0];
            }
        } else {
            if (criteria?.type === CriteriaType.CompleteQuest) {
                for (const character of characters) {
                    if (userQuestData.characters[character.id]?.quests?.has(criteria.asset)) {
                        characterCounts[character.id] = (characterCounts[character.id] || 0) + 1;
                    }
                }
            } else if (criteria?.type === CriteriaType.RaiseSkillLine) {
                for (const character of characters) {
                    for (const subProfessions of Object.values(character.professions || {})) {
                        const subProfession = subProfessions[criteria.asset];
                        if (subProfession) {
                            characterCounts[character.id] =
                                (characterCounts[character.id] || 0) + subProfession.currentSkill;
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
            } else {
                for (const [characterId, count] of userAchievementData.criteria[criteriaTree.id] ??
                    []) {
                    if (characterIds.indexOf(characterId) < 0) {
                        continue;
                    }

                    if (achievement.id === debugId) {
                        console.log(
                            characterId,
                            userData.characterMap[characterId].name,
                            count,
                            addStuff,
                        );
                    }

                    // && !(criteriaTree.id === rootCriteriaTree.id && criteriaTree.children.length > 0)
                    if (addStuff) {
                        characterCounts[characterId] =
                            (characterCounts[characterId] || 0) +
                            (parentCriteriaTree?.operator === CriteriaTreeOperator.SumChildren
                                ? count
                                : Math.min(Math.max(1, criteriaTree.amount), count));
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

    ret.characters = sortBy(
        Object.entries(characterCounts).filter(([, count]) => count > 0),
        ([characterId, count]) => [10000000 - count, characterId],
    ).map(([characterId, count]) => [parseInt(characterId), count]);

    if (achievement.id === debugId) {
        console.log(characterCounts);
        console.log(ret);
    }

    return ret;
}
