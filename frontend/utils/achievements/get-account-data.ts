import { get } from 'svelte/store'

import { achievementStore, userAchievementStore } from '@/stores'
import type { AchievementDataCriteriaTree, Dictionary } from '@/types'

export function getAccountData(criteriaTree: AchievementDataCriteriaTree): AchievementDataAccount {
    const ctMap = get(achievementStore).data.criteriaTree
    const userCrits = get(userAchievementStore).data.criteria

    const ret = new AchievementDataAccount()

    for (const child of criteriaTree.children) {
        const childTree = ctMap[child]
        if (childTree) {
            ret.criteria.push(childTree)

            const value: number[] = (userCrits[child] || [[]])[0]
            ret.have[child] = value ? value[1] : 0
        }
    }

    return ret
}

export class AchievementDataAccount {
    criteria: AchievementDataCriteriaTree[]
    have: Dictionary<number>

    constructor() {
        this.criteria = []
        this.have = {}
    }
}
