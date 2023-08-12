import { Constants } from '@/data/constants'
import type { Faction } from '@/enums'
import type { StaticDataRealm } from '@/types/data/static'
import type { Guild } from '@/types/guild'

import type { CharacterConfiguration } from './configuration'
import { CharacterCurrency, type CharacterCurrencyArray } from './currency'
import type { CharacterEquippedItem } from './equipped-item'
import type { CharacterGarrison } from './garrison'
import { CharacterItem, type CharacterItemArray } from './item'
import type { CharacterLockout } from './lockout'
import {
    CharacterMythicPlusAddonRun,
    type CharacterMythicPlus,
    type CharacterMythicPlusAddon,
    type CharacterMythicPlusAddonMap,
    type CharacterMythicPlusAddonRunArray
} from './mythic-plus'
import type { CharacterProfession } from './profession'
import type { CharacterRaiderIoSeason } from './raider-io-season'
import type { CharacterReputation, CharacterReputationParagon } from './reputation'
import type { CharacterShadowlands } from './shadowlands'
import type { CharacterSpecializationRaw } from './specialization'
import {
    CharacterStatistics,
    CharacterStatisticBasic,
    CharacterStatisticMisc,
    CharacterStatisticRating,
    type CharacterStatisticBasicArray,
    type CharacterStatisticMiscArray,
    type CharacterStatisticRatingArray
} from './statistics'
import type { CharacterWeekly } from './weekly'

import type { ContainsItems, HasNameAndRealm } from '../shared'
import type { Account } from '../account'


export class Character implements ContainsItems, HasNameAndRealm {
    // Calculated
    public account: Account
    public guild: Guild
    public realm: StaticDataRealm

    public className: string
    public raceName: string
    public specializationName: string

    public calculatedItemLevel: string
    public calculatedItemLevelQuality: number

    public bags: Record<number, number> = {}
    public currencies: Record<number, CharacterCurrency> = {}
    public itemsByAppearanceId: Record<number, CharacterItem[]>
    public itemsByAppearanceSource: Record<string, CharacterItem[]>
    public itemsById: Record<number, CharacterItem[]>
    public itemsByLocation: Record<number, CharacterItem[]>
    public mythicPlusSeasonScores: Record<number, number>
    public mythicPlusWeeks: Record<number, CharacterMythicPlusAddonRun[]> = {}
    public reputationData: Record<string, CharacterReputation>
    public specializations: Record<number, Record<number, number>> = {}
    public statistics: CharacterStatistics = new CharacterStatistics()

    constructor(
        public id: number,
        public name: string,
        public isResting: number,
        public isWarMode: number,
        public accountId: number,
        public activeSpecId: number,
        public addonLevel: number,
        public addonLevelXp: number,
        public chromieTime: number,
        public classId: number,
        public equippedItemLevel: number,
        public faction: Faction,
        public gender: number,
        public guildId: number,
        public level: number,
        public playedTotal: number,
        public raceId: number,
        public realmId: number,
        public restedExperience: number,
        public gold: number,
        public currentLocation: string,
        public hearthLocation: string,
        public lastSeenAddon: number,

        public configuration: CharacterConfiguration,

        public auras: Record<number, number>,
        public equippedItems: Record<number, CharacterEquippedItem>,
        public garrisons: Record<number, CharacterGarrison>,
        public garrisonTrees: Record<number, Record<number, number[]>>,
        public lockouts: Record<string, CharacterLockout>,
        public mythicPlus: CharacterMythicPlus,
        public mythicPlusAddon: Record<number, CharacterMythicPlusAddon>,
        public mythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMap>>,
        public paragons: Record<number, CharacterReputationParagon>,
        public professions: Record<number, Record<number, CharacterProfession>>,
        public professionCooldowns: Record<string, [number, number, number]>,
        public professionTraits: Record<number, Record<number, number>>,
        public raiderIo: Record<number, CharacterRaiderIoSeason>,
        public reputations: Record<number, number>,
        public shadowlands: CharacterShadowlands,
        public weekly: CharacterWeekly,

        rawCurrencies: CharacterCurrencyArray[],
        rawItems: CharacterItemArray[],
        rawMythicPlusWeeks: Record<number, CharacterMythicPlusAddonRunArray[]>,
        rawSpecializations: Record<number, CharacterSpecializationRaw>,
        rawStatistics: [
            CharacterStatisticBasicArray[],
            CharacterStatisticMiscArray[],
            CharacterStatisticRatingArray[]
        ]
    )
    {
        this.itemsByAppearanceId = {}
        this.itemsByAppearanceSource = {}
        this.itemsById = {}
        this.itemsByLocation = {}

        for (const rawCurrency of (rawCurrencies || [])) {
            const obj = new CharacterCurrency(...rawCurrency)
            this.currencies[obj.id] = obj
        }

        for (const rawItem of (rawItems || [])) {
            const obj = new CharacterItem(...rawItem) 
            if (obj.slot === 0) {
                this.bags[obj.bagId] = obj.itemId
            }
            else {
                (this.itemsByLocation[obj.location] ||= []).push(obj)
            }
        }
        // console.log(this.itemsByLocation)

        for (const [week, runsArray] of Object.entries(rawMythicPlusWeeks || {})) {
            this.mythicPlusWeeks[parseInt(week)] = runsArray
                .map((runArray) => new CharacterMythicPlusAddonRun(...runArray))
        }

        for (const specializationId in rawSpecializations) {
            const specData: Record<number, number> = {}
            for (const [tierId, , spellId] of rawSpecializations[specializationId].talents) {
                specData[tierId] = spellId
            }
            this.specializations[specializationId] = specData
        }

        if (rawStatistics?.length === 3) {
            for (const basicArray of rawStatistics[0]) {
                const obj = new CharacterStatisticBasic(...basicArray)
                this.statistics.basic[obj.type] = obj
            }

            for (const miscArray of rawStatistics[1]) {
                const obj = new CharacterStatisticMisc(...miscArray)
                this.statistics.misc[obj.type] = obj
            }

            for (const ratingArray of rawStatistics[2]) {
                const obj = new CharacterStatisticRating(...ratingArray)
                this.statistics.rating[obj.type] = obj
            }
        }
    }

    get isMaxLevel(): boolean {
        return this.level === Constants.characterMaxLevel
    }

    getItemCount(itemId: number): number {
        return (this.itemsById[itemId] || []).reduce((a, b) => a + b.count, 0)
    }
}
export type CharacterArray = ConstructorParameters<typeof Character>
