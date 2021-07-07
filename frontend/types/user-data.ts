import type { Account } from './account'
import type { Character } from './character'
import type { Dictionary } from './dictionary'
import type { InstanceDifficulty } from './dungeon'

export interface UserData {
    public: boolean

    accounts?: Account[]
    characters: Character[]
    currentPeriod: Dictionary<UserDataCurrentPeriod>
    mounts: Dictionary<number>
    setCounts: Dictionary<Dictionary<UserDataSetCount>>
    toys: Dictionary<number>

    // Calculated
    allLockouts: InstanceDifficulty[]
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
