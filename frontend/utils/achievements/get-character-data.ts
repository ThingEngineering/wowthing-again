import sortBy from 'lodash/sortBy'

import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData,
    UserData,
} from '@/types'
import type { UserQuestData } from '@/types/data'


const debugId = 14307

export function getCharacterData(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    userData: UserData,
    userQuestData: UserQuestData,
    achievement: AchievementDataAchievement
): AchievementDataCharacter {
    const ret: AchievementDataCharacter = {
        characters: [],
        criteriaTrees: [],
        total: 0
    }

    const characterCounts: Record<number, number> = {}
    const rootCriteriaTree = achievementData.criteriaTree[achievement.criteriaTreeId]


    function recurse(
        criteriaTree: AchievementDataCriteriaTree,
        addStuff = true,
        first = false,
    ) {
        if (!criteriaTree) {
            return
        }

        //const criteriaTree = achievementData.criteriaTree[criteriaTreeId]
        const criteria = achievementData.criteria[criteriaTree.criteriaId]

        if (addStuff && criteriaTree.amount > 0) {
            ret.total += criteriaTree.amount
        }

        if (!first) {
            ret.criteriaTrees.push([criteriaTree])
        }

        if (achievement.id === debugId) {
            console.log('-', criteriaTree, criteriaTree.criteriaId, criteria)
            console.log('--', userAchievementData.criteria[criteriaTree.id] ?? [])
        }

        //console.log('boo', criteria?.type, criteria?.asset)
        for (const [characterId, count] of userAchievementData.criteria[criteriaTree.id] ?? []) {
            if (achievement.id === debugId) {
                console.log(characterId, userData.characterMap[characterId].name, count)
            }

            if (addStuff) {
                characterCounts[characterId] = (characterCounts[characterId] || 0) + Math.min(criteriaTree.amount, count)
            }
        }

        if (addStuff && criteriaTree.amount > 0) {
            addStuff = false
        }

        for (const criteriaTreeId of criteriaTree.children) {
            recurse(achievementData.criteriaTree[criteriaTreeId], addStuff)
        }
    }

    recurse(rootCriteriaTree, true, true)

    ret.characters = sortBy(
        Object.entries(characterCounts)
            .filter(([, count]) => count > 0),
        ([characterId, count]) => [10000000 - count, characterId]
    )
        .slice(0, 3)
        .map(([characterId, count]) => [parseInt(characterId), count])

    if (achievement.id === debugId) {
        console.log(characterCounts)
        console.log(ret)
    }

    return ret
}

export interface AchievementDataCharacter {
    characters: [number, number][]
    criteriaTrees: AchievementDataCriteriaTree[][]
    total: number
}
