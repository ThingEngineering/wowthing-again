import type { Writable } from 'svelte/store'

import type { Dictionary } from '@/types'
import { AchievementFlags } from '@/types/enums'

export interface AchievementDataStore {
    data?: AchievementData
    error: boolean
    loading: boolean
}

export interface WritableAchievementDataStore extends Writable<AchievementDataStore> {
    fetch(): Promise<void>
}

export interface AchievementData {
    categories: AchievementDataCategory[]

    achievement: Dictionary<AchievementDataAchievement>
    criteria: Dictionary<AchievementDataCriteria>
    criteriaTree: Dictionary<AchievementDataCriteriaTree>

    achievementRaw: AchievementDataAchievementArray[]
    criteriaRaw: AchievementDataCriteriaArray[]
    criteriaTreeRaw: AchievementDataCriteriaTreeArray[]
}

export interface AchievementDataCategory {
    id: number
    name: string
    slug: string
    achievementIds: number[]
    children: AchievementDataCategory[]
}

export class AchievementDataAchievement {
    constructor(
        public id: number,
        public categoryId: number,
        public criteriaTreeId: number,
        public faction: number,
        public flags: number,
        public minimumCriteria: number,
        public order: number,
        public points: number,
        public supersededBy: number,
        public supersedes: number,
        public description: string,
        public name: string,
        public reward: string,
    )
    { }

    get isAccountWide(): boolean {
        return (this.flags & AchievementFlags.AccountWide) > 0
    }
}

type AchievementDataAchievementArray = ConstructorParameters<typeof AchievementDataAchievement>

export class AchievementDataCriteria {
    constructor(
        public id: number,
        public asset: number,
        public modifierTreeId: number,
        public type: number,
    )
    { }
}

type AchievementDataCriteriaArray = ConstructorParameters<typeof AchievementDataCriteria>

export class AchievementDataCriteriaTree {
    constructor(
        public id: number,
        public amount: number,
        public criteriaId: number,
        public flags: number,
        public operator: number,
        public description: string,
        public children: number[],
    )
    { }
}

type AchievementDataCriteriaTreeArray = ConstructorParameters<typeof AchievementDataCriteriaTree>
