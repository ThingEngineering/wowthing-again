import type { Dictionary } from './dictionary'
import type {Faction} from '@/data/faction'

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
    realmId: number
    raceId: number

    calculatedItemLevel: string
    calculatedItemLevelQuality: number

    currencies: Dictionary<CharacterCurrency>
    equippedItems: Dictionary<CharacterEquippedItem>
    mythicPlus: CharacterMythicPlus
    quests: Dictionary<number>
    raiderIo: Dictionary<CharacterRaiderIoSeason>
    reputations: Dictionary<number>
    shadowlands?: CharacterShadowlands
    weekly?: CharacterWeekly
}

export interface CharacterCurrency {
    total: number
    totalMax: number
    week: number
    weekMax: number
}

export interface CharacterEquippedItem {
    context: number
    itemId: number
    itemLevel: number
    quality: number

    bonusIds: number[]
    enchantmentIds: number[]
}

export interface CharacterMythicPlus {
    currentPeriodId: number
    periodRuns: Dictionary<CharacterMythicPlusRun[]>
    seasons: Dictionary<Dictionary<CharacterMythicPlusRun[]>>
    seasonBadges: Dictionary<string>
}

export interface CharacterMythicPlusRun {
    affixes: number[]
    completed: string
    dungeonId: number
    duration: number
    keystoneLevel: number
    members: CharacterMythicPlusRunMember[]
    timed: boolean
}

export interface CharacterMythicPlusRunMember {
    itemLevel: number
    name: string
    realmId: number
    specializationId: number
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

interface CharacterShadowlands {
    conduits: number[][]
    covenantId: number
    renownLevel: number
    soulbindId: number
}

interface CharacterWeekly {
    keystoneDungeon: number
    keystoneLevel: number

    torghast: Dictionary<number>
    ughQuests: Dictionary<CharacterWeeklyUghQuest>
    vault: CharacterWeeklyVault
}

export interface CharacterWeeklyUghQuest {
    have?: number
    need?: number
    status: number
    text?: string
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
