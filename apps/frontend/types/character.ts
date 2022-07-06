import type { StaticDataRealm } from '@/types/data/static'
import type { Faction } from '@/types/enums'

export interface Character {
    accountId?: number
    activeSpecId: number
    chromieTime: number
    classId: number
    equippedItemLevel: number
    faction: Faction
    gender: number
    gold: number
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

    // Calculated
    calculatedItemLevel: string
    calculatedItemLevelQuality: number
    currencies: Record<number, CharacterCurrency>
    professions: Record<number, Record<number, CharacterProfession>>
    realm: StaticDataRealm
    reputationData: Record<string, CharacterReputation>
    specializations: Record<number, Record<number, number>>

    bags: Record<number, number>
    currenciesRaw: CharacterCurrencyArray[]
    equippedItems: Record<number, CharacterEquippedItem>
    garrisonTrees: Record<number, Record<number, number[]>>
    lockouts: Record<string, CharacterLockout>
    mythicPlus: CharacterMythicPlus
    mythicPlusAddon: Record<number, CharacterMythicPlusAddon>
    paragons: Record<number, CharacterReputationParagon>
    progressItems: number[]
    raiderIo: Record<number, CharacterRaiderIoSeason>
    reputations: Record<number, number>
    shadowlands?: CharacterShadowlands
    specializationsRaw: Record<number, CharacterApiSpecialization>
    weekly?: CharacterWeekly
}

export class CharacterApiSpecialization {
    talents: number[][]
}

export class CharacterCurrency {
    constructor(
        public id: number,
        public quantity: number,
        public max: number,
        public weekQuantity: number,
        public weekMax: number,
        public totalQuantity: number,
        public isWeekly: boolean,
        public isMovingMax: boolean
    )
    { }
}

type CharacterCurrencyArray = ConstructorParameters<typeof CharacterCurrency>

export interface CharacterEquippedItem {
    context: number
    itemId: number
    itemLevel: number
    quality: number

    bonusIds: number[]
    enchantmentIds: number[]
    gemIds: number[]
}

export interface CharacterGear {
    equipped: CharacterEquippedItem
    highlight: boolean
    missingEnchant: boolean
    missingGem: boolean
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

export interface CharacterMythicPlusAddonRun {
    completed: boolean
    level: number
    mapId: number
    score: number
}

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
    mythicPlusRuns: number[][]
    rankedPvpProgress: CharacterWeeklyProgress[]
    raidProgress: CharacterWeeklyProgress[]
}

export interface CharacterWeeklyProgress {
    level: number
    progress: number
    threshold: number
}
