import type { Writable } from 'svelte/store'

import type { Account } from './account'
import type { Character } from './character'
import type { Dictionary } from './dictionary'
import type { InstanceDifficulty } from './dungeon'

export interface UserDataStore {
    data?: UserData
    error: boolean
    loading: boolean
}

export interface WritableUserDataStore extends Writable<UserDataStore> {
    fetch(): Promise<void>
}

export interface UserData {
    public: boolean

    accounts?: Account[]
    characters: Character[]
    currentPeriod: Dictionary<UserDataCurrentPeriod>
    setCounts: Dictionary<Dictionary<UserDataSetCount>>

    // Packed data
    achievementsPacked: string
    mountsPacked: string
    toysPacked: string

    // Calculated
    achievements: Dictionary<number>
    achievementCategories?: Dictionary<UserDataAchievementCategory>
    achievementRecent?: number[]
    allLockouts: InstanceDifficulty[]
    mounts: Dictionary<boolean>
    toys: Dictionary<boolean>
}

export class UserDataAchievementCategory {
    constructor(
        public have: number,
        public points: number,
        public total: number
    ) {
    }
}

export interface UserDataCurrentPeriod {
    id: number
    region: number
    starts: string
    ends: string
}

interface UserDataSetCount {
    have: number
    total: number
}
