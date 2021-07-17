import type { Account } from './account'
import type { Character } from './character'
import type { Dictionary } from './dictionary'
import type { InstanceDifficulty } from './dungeon'

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
    allLockouts: InstanceDifficulty[]
    mounts: Dictionary<boolean>
    toys: Dictionary<boolean>
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
