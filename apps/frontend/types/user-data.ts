import { DateTime } from 'luxon'

import parseApiTime from '@/utils/parse-api-time'

import type { Account } from './account'
import type { BackgroundImage } from './background-image'
import type { Character, CharacterArray } from './character'
import type { InstanceDifficulty } from './dungeon'
import type { ItemQuality } from '../enums'
import type { Guild, GuildArray } from './guild'
import type { HasNameAndRealm, UserItem } from './shared'
import type { UserCount } from './user-count'


export interface UserData {
    lastApiCheck: string
    public: boolean

    accounts: Record<number, Account>
    charactersRaw: CharacterArray[]
    goldHistoryRealms: number[]
    guildsRaw: GuildArray[]
    heirlooms: Record<number, number>
    raiderIoScoreTiers: Record<number, UserDataRaiderIoScoreTiers>

    honorCurrent: number
    honorLevel: number
    honorMax: number

    backgrounds: Record<number, BackgroundImage>
    currentPeriod: Record<number, UserDataCurrentPeriod>
    globalDailies: Record<string, DailyQuests>
    images: Record<string, string>

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
    characters: Character[]
    guildMap: Record<number, Guild>
    homeLockouts: InstanceDifficulty[]

    hasMount: Record<number, boolean>
    hasPet: Record<number, boolean>
    hasToy: Record<number, boolean>
    hasToyById: Record<number, boolean>

    itemsByAppearanceId: Record<number, [HasNameAndRealm, UserItem[]][]>
    itemsByAppearanceSource: Record<string, [HasNameAndRealm, UserItem[]][]>
    itemsById: Record<number, [HasNameAndRealm, UserItem[]][]>

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

export interface UserDataRaiderIoScoreTiers {
    score: number[]
    rgbHex: string[]
}

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
