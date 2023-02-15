import { DateTime } from 'luxon'

import type { Account } from './account'
import type { BackgroundImage } from './background-image'
import type { Character } from './character'
import type { InstanceDifficulty } from './dungeon'
import type { ItemQuality } from '../enums'
import type { Guild } from './guild'
import type { UserCount } from './user-count'
import parseApiTime from '@/utils/parse-api-time'


export interface UserData {
    lastApiCheck: string
    public: boolean

    accounts: Record<number, Account>
    characters: Character[]
    charactersRaw: Character[]
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
    allRegions: number[]
    backgroundList: BackgroundImage[]
    characterMap: Record<number, Character>
    homeLockouts: InstanceDifficulty[]

    hasMount: Record<number, boolean>
    hasPet: Record<number, boolean>
    hasToy: Record<number, boolean>

    pets: Record<number, UserDataPet[]>
    setCounts: Record<string, Record<string, UserCount>>
}

export class UserDataCurrentPeriod {
    public id: number
    public region: number
    public starts: string
    public ends: string

    private _startTime: DateTime
    get startTime(): DateTime {
        if (!this._startTime) {
            this._startTime = parseApiTime(this.starts)
        }
        return this._startTime
    }
    
    set startTime(time: DateTime) {
        this._startTime = time
    }

    private _endTime: DateTime
    get endTime(): DateTime {
        if (!this._endTime) {
            if (this.ends) {
                this._endTime = parseApiTime(this.ends)
            }
            else {
                this._endTime = DateTime.fromObject({
                    year: 2099,
                })
            }
        }
        return this._endTime
    }
    
    set endTime(time: DateTime) {
        this._endTime = time
    }
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
