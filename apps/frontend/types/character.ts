import { Constants } from '@/data/constants'
import type { Faction } from '@/enums'
import type { StaticDataRealm } from '@/types/data/static'
import type { Guild } from './guild'


export class Character {
    accountId?: number
    activeSpecId: number
    addonLevel: number
    addonLevelXp: number
    chromieTime: number
    classId: number
    currentLocation: string
    equippedItemLevel: number
    faction: Faction
    gender: number
    gold: number
    guildId?: number
    hearthLocation: string
    id: number
    isResting: boolean
    isWarMode: boolean
    level: number
    mountSkill: number
    name: string
    playedTotal: number
    raceId: number
    realmId: number
    restedExperience: number

    lastSeenAddon: string

    auras: Record<number, number>
    bags: Record<number, number>
    configuration: CharacterConfiguration
    currenciesRaw: CharacterCurrencyArray[]
    currencyItems: Record<number, number>
    equippedItems: Record<number, CharacterEquippedItem>
    garrisons: Record<number, CharacterGarrison>
    garrisonTrees: Record<number, Record<number, number[]>>
    lockouts: Record<string, CharacterLockout>
    mythicPlus: CharacterMythicPlus
    mythicPlusAddon: Record<number, CharacterMythicPlusAddon>
    mythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMap>>
    paragons: Record<number, CharacterReputationParagon>
    professionTraits: Record<number, Record<number, number>>
    progressItems: number[]
    raiderIo: Record<number, CharacterRaiderIoSeason>
    reputations: Record<number, number>
    shadowlands?: CharacterShadowlands
    specializationsRaw: Record<number, CharacterApiSpecialization>
    weekly?: CharacterWeekly

    mythicPlusWeeks: Record<number, CharacterMythicPlusAddonRun[]>
    rawMythicPlusWeeks: Record<number, CharacterMythicPlusAddonRunArray[]>

    // Calculated
    className: string
    raceName: string
    specializationName: string

    calculatedItemLevel: string
    calculatedItemLevelQuality: number
    currencies: Record<number, CharacterCurrency>
    guild: Guild
    mythicPlusSeasonScores: Record<number, number>
    professions: Record<number, Record<number, CharacterProfession>>
    realm: StaticDataRealm
    reputationData: Record<string, CharacterReputation>
    specializations: Record<number, Record<number, number>>

    initialize(): void {
        this.mythicPlusWeeks = {}
        for (const [week, runsArray] of Object.entries(this.rawMythicPlusWeeks)) {
            this.mythicPlusWeeks[parseInt(week)] = runsArray
                .map((runArray) => new CharacterMythicPlusAddonRun(...runArray))
        }
        this.rawMythicPlusWeeks = null
    }

    get isMaxLevel(): boolean {
        return this.level === Constants.characterMaxLevel
    }

}

export class CharacterApiSpecialization {
    talents: number[][]
}

export class CharacterConfiguration {
    public backgroundId: number
    public backgroundBrightness: number
    public backgroundSaturation: number
}

export class CharacterCurrency {
    public isWeekly: boolean
    public isMovingMax: boolean
    
    constructor(
        public quantity: number,
        public max: number,
        public weekQuantity: number,
        public weekMax: number,
        public totalQuantity: number,
        public id: number,
        isWeekly: number,
        isMovingMax: number
    )
    {
        this.isWeekly = isWeekly === 1
        this.isMovingMax = isMovingMax === 1
    }
}

type CharacterCurrencyArray = ConstructorParameters<typeof CharacterCurrency>

export interface CharacterEquippedItem {
    context: number
    craftedQuality: number
    itemId: number
    itemLevel: number
    quality: number

    bonusIds: number[]
    enchantmentIds: number[]
    gemIds: number[]
}

export interface CharacterGarrison {
    level: number
    type: number
    buildings: CharacterGarrisonBuilding[]
}

export interface CharacterGarrisonBuilding {
    buildingId: number
    name: string
    plotId: number
    rank: number
}

export interface CharacterGear {
    equipped: CharacterEquippedItem
    highlight: boolean
    lowItemLevel: boolean
    missingEnchant: boolean
    missingGem: boolean
    missingHeirloom: boolean
    missingUpgrade: boolean
    upgradeHas: number
    upgradeMax: number
}

export interface CharacterLockout {
    bosses: CharacterLockoutBoss[]
    defeatedBosses: number
    difficulty: number
    id: number
    locked: boolean
    maxBosses: number
    name: string
    resetTime: string // datetime?
}

export interface CharacterLockoutBoss {
    dead: boolean
    name: string
}

export interface CharacterMythicPlus {
    currentPeriodId: number
    periodRuns: Record<number, CharacterMythicPlusRun[]>
    seasons: Record<number, Record<number, CharacterMythicPlusRun[]>>
}

export interface CharacterMythicPlusAddon {
    maps: Record<number, CharacterMythicPlusAddonMap>
    runs: Array<CharacterMythicPlusAddonRun>
    season: number
}

export class CharacterMythicPlusAddonRun {
    constructor(
        public mapId: number,
        public level: number,
        public score: number,
        public completed: boolean
    ) { }
}
export type CharacterMythicPlusAddonRunArray = ConstructorParameters<typeof CharacterMythicPlusAddonRun>

export interface CharacterMythicPlusAddonMap {
    overallScore: number
    fortifiedScore: CharacterMythicPlusAddonMapAffix
    tyrannicalScore: CharacterMythicPlusAddonMapAffix
}

export interface CharacterMythicPlusAddonMapAffix {
    durationSec: number
    level: number
    overTime: boolean
    score: number
}

export interface CharacterMythicPlusRun {
    affixes: number[]
    completed: string
    dungeonId: number
    duration: number
    keystoneLevel: number
    members: CharacterMythicPlusRunMemberArray[]
    memberObjects: CharacterMythicPlusRunMember[]
    timed: boolean
}

export class CharacterMythicPlusRunMember {
    constructor(
        public realmId: number,
        public name: string,
        public specializationId: number,
        public itemLevel: number
    )
    { }
}

type CharacterMythicPlusRunMemberArray = ConstructorParameters<typeof CharacterMythicPlusRunMember>

export interface CharacterProfession {
    currentSkill: number
    maxSkill: number
    knownRecipes: number[]
}

export interface CharacterRaiderIoSeason {
    [key: string]: number

    all: number
    dps: number
    healer: number
    spec1: number
    spec2: number
    spec3: number
    spec4: number
    tank: number
}

export interface CharacterReputation {
    sets: CharacterReputationReputation[][]
}

export interface CharacterReputationReputation {
    reputationId: number
    value: number
}

export interface CharacterReputationParagon {
    rewardAvailable: boolean
    current: number
    max: number
    received: number
}

export interface CharacterShadowlands {
    covenantId: number
    renownLevel: number
    soulbindId: number
    conduits: number[][]
    covenants: Record<number, CharacterShadowlandsCovenant>
}

export interface CharacterShadowlandsCovenant {
    anima: number
    renown: number
    souls: number
    conductor: CharacterShadowlandsCovenantFeature
    missions: CharacterShadowlandsCovenantFeature
    transport: CharacterShadowlandsCovenantFeature
    unique: CharacterShadowlandsCovenantFeature
    soulbinds: CharacterShadowlandsSoulbind[]
}

export interface CharacterShadowlandsCovenantFeature {
    rank: number
    researchEnds: number
    name: string
}

export interface CharacterShadowlandsSoulbind {
    id: number
    specializations: number[]
    tree: number[][]
    unlocked: boolean
}

interface CharacterWeekly {
    keystoneScannedAt: string

    keystoneDungeon: number
    keystoneLevel: number

    vault: CharacterWeeklyVault
}

interface CharacterWeeklyVault {
    mythicPlusProgress: CharacterWeeklyProgress[]
    rankedPvpProgress: CharacterWeeklyProgress[]
    raidProgress: CharacterWeeklyProgress[]
}

export interface CharacterWeeklyProgress {
    level: number
    progress: number
    threshold: number
}
