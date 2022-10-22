import type { Account } from './account'
import type { BackgroundImage } from './background-image'
import type { Character } from './character'
import type { InstanceDifficulty } from './dungeon'
import type { ItemQuality } from '../enums'
import type { Guild } from './guild'
import type { UserCount } from './user-count'


export interface UserData {
    lastApiCheck: string
    public: boolean

    accounts: Record<number, Account>
    characters: Character[]
    guilds: Record<number, Guild>
    goldHistoryRealms: number[]
    heirlooms: Record<number, number>

    honorCurrent: number
    honorLevel: number
    honorMax: number

    backgrounds: Record<number, BackgroundImage>
    currentPeriod: Record<number, UserDataCurrentPeriod>
    globalDailies: Record<string, DailyQuests>
    images: Record<string, string>

    addonMounts: Record<number, boolean>

    // Packed data
    mountsPacked: string
    toysPacked: string

    petsRaw: Record<number, UserDataPetArray[]>

    // Calculated
    allLockouts: InstanceDifficulty[]
    allLockoutsMap: Record<string, InstanceDifficulty>
    backgroundList: BackgroundImage[]
    characterMap: Record<number, Character>
    homeLockouts: InstanceDifficulty[]

    hasMount: Record<number, boolean>
    hasPet: Record<number, boolean>
    hasToy: Record<number, boolean>

    pets: Record<number, UserDataPet[]>
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

export interface DailyQuests {
    expansion: number
    questExpires: number[]
    questIds: number[]
    questRewards: DailyQuestsReward[]
    region: number
}

export interface DailyQuestsReward {
    currencyId: number
    itemId: number
    money: number
    quality: ItemQuality
    quantity: number
}
