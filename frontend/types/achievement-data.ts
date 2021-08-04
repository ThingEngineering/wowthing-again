import type { Writable } from 'svelte/store'

import type { Dictionary } from '@/types'

export interface AchievementDataStore {
    data?: AchievementData
    error: boolean
    loading: boolean
}

export interface WritableAchievementDataStore extends Writable<AchievementDataStore> {
    fetch(): Promise<void>
}

export interface AchievementData {
    achievements: Dictionary<AchievementDataAchievement>
    categories: AchievementDataCategory[]
}

export interface AchievementDataAchievement {
    categoryId: number
    criteriaTreeId: number
    description: string
    faction: number
    flags: number
    id: number
    minimumCriteria: number
    name: string
    order: number
    points: number
    reward: string
    supersededBy: number
    supersedes: number
}

export interface AchievementDataCategory {
    id: number
    name: string
    slug: string
    achievementIds: number[]
    children: AchievementDataCategory[]
}
