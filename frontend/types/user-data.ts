import type { Account } from './account'
import type { Character } from './character'
import type { InstanceDifficulty } from './dungeon'


export interface UserData {
    public: boolean

    accounts: Account[]
    characters: Character[]
    currentPeriod: Record<number, UserDataCurrentPeriod>

    // Calculated
    allLockouts: InstanceDifficulty[]
    allLockoutsMap: Record<string, InstanceDifficulty>
    characterMap: Record<number, Character>
}

export interface UserDataCurrentPeriod {
    id: number
    region: number
    starts: string
    ends: string
}
