import sortBy from 'lodash/sortBy'

import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData,
} from '@/types'
import type { UserQuestData } from '@/types/data'
import { CriteriaType } from '@/types/enums/criteria-type'


export function getCharacterData(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    userQuestData: UserQuestData,
    achievement: AchievementDataAchievement
): AchievementDataCharacter {
    const ret: AchievementDataCharacter = {
        characters: [],
        criteriaTrees: [],
    }

    const characterCounts: Record<number, number> = {}
    const rootCriteriaTree = achievementData.criteriaTree[achievement.criteriaTreeId]

    //console.log('-----')
    //console.log(achievement)
    //console.log(rootCriteriaTree)

    for (const criteriaTreeId of rootCriteriaTree.children) {
        const criteriaTree = achievementData.criteriaTree[criteriaTreeId]
        const criteria = achievementData.criteria[criteriaTree.criteriaId]

        ret.criteriaTrees.push([criteriaTree])

        //console.log('-', criteriaTree, criteriaTree.criteriaId, criteria)
        //console.log('--', userAchievementData.criteria[criteriaTree.criteriaId] ?? [])

        if (criteria?.type === CriteriaType.CompleteQuest) {
            //console.log('yay', criteria.type, criteria.asset)
            for (const characterId in userQuestData.characters) {
                if (userQuestData.characters[characterId].quests.get(criteria.asset)) {
                    characterCounts[characterId] = (characterCounts[characterId] || 0) + 1
                }
            }
        }
        else {
            //console.log('boo', criteria?.type, criteria?.asset)
            for (const [characterId, count] of userAchievementData.criteria[criteriaTree.criteriaId] ?? []) {
                characterCounts[characterId] = (characterCounts[characterId] || 0) + count
            }
        }
    }

    ret.characters = sortBy(
        Object.entries(characterCounts)
            .filter(([, count]) => count > 0),
        ([characterId, count]) => [10000000 - count, characterId]
    )
        .slice(0, 3)
        .map(([characterId, count]) => [parseInt(characterId), count])

    //console.log('--', ret.characters)

    return ret
}

export interface AchievementDataCharacter {
    characters: [number, number][]
    criteriaTrees: AchievementDataCriteriaTree[][]
}
