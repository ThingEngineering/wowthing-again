import { get } from 'svelte/store'

import { achievementStore, userAchievementStore } from '@/stores'
import type {
    AchievementData,
    AchievementDataAchievement,
    AchievementDataCriteriaTree,
    UserAchievementData
} from '@/types'

export function getAccountData(
    achievementData: AchievementData,
    userAchievementData: UserAchievementData,
    achievement: AchievementDataAchievement
): AchievementDataAccount {
    //const ctMap = get(achievementStore).data.criteriaTree
    //const userCrits = get(userAchievementStore).data.criteria

    const ret = new AchievementDataAccount()

    const rootCriteriaTree = achievementData.criteriaTree[achievement.criteriaTreeId]

    for (const child of rootCriteriaTree.children) {
        const childTree = achievementData.criteriaTree[child]
        if (childTree) {
            ret.criteria.push(childTree)

            const value: number[] = (userAchievementData.criteria[child] || [[]])[0]
            ret.have[child] = value[1] || 0

            if (ret.have[child] === 0) {
                for (const childChild of childTree.children) {
                    const value: number[] = (userAchievementData.criteria[childChild] || [[]])[0]
                    ret.have[child] = value[1] || 0
                }
            }
        }
    }

    if (achievement.id === 8728) {
        console.log(ret)
    }

    return ret
}

export class AchievementDataAccount {
    criteria: AchievementDataCriteriaTree[]
    have: Record<number, number>

    constructor() {
        this.criteria = []
        this.have = {}
    }
}
