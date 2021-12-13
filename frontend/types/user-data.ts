import type { Account } from './account'
import type { Character } from './character'
import type { InstanceDifficulty } from './dungeon'
import type { UserCount } from './user-count'


export interface UserData {
    public: boolean

    accounts: Account[]
    characters: Character[]
    currentPeriod: Record<number, UserDataCurrentPeriod>

    addonMounts: Record<number, boolean>

    // Packed data
    mountsPacked: string
    toysPacked: string

    petsRaw: Record<number, UserDataPetArray[]>

    // Calculated
    allLockouts: InstanceDifficulty[]
    allLockoutsMap: Record<string, InstanceDifficulty>
    characterMap: Record<number, Character>

    mounts: Record<number, boolean>
    pets: Record<number, UserDataPet[]>
    petsHas: Record<number, boolean>
    toys: Record<number, boolean>
    setCounts: Record<string, Record<string, UserCount>>
}

export interface UserDataCurrentPeriod {
    id: number
    region: number
    starts: string
    ends: string
}


export class UserDataPet {
    constructor(
        public level: number,
        public quality: number,
        public breedId: number
    )
    {}
}

export type UserDataPetArray = ConstructorParameters<typeof UserDataPet>
