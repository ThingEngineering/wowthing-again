import type {Dictionary} from './dictionary'

export interface Character {
    name: string
    realmId: number
    faction: number
    gender: number
    raceId: number
    classId: number
    activeSpecId: number
    level: number
    equippedItemLevel: number
    calculatedItemLevel: string
    calculatedItemLevelQuality: number

    accountId?: number

    equippedItems: Dictionary<CharacterEquippedItem>
    mythicPlus: CharacterMythicPlus
    raiderIo: Dictionary<CharacterRaiderIoSeason>
    reputations: Dictionary<number>
    shadowlands?: CharacterShadowlands
    weekly?: CharacterWeekly
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

interface CharacterMythicPlusRunMember {
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

    vault: CharacterWeeklyVault
}

interface CharacterWeeklyVault {
    mythicPlusProgress: CharacterWeeklyProgress[]
    mythicPlusRuns: Array<Array<number>>
    rankedPvpProgress: CharacterWeeklyProgress[]
    raidProgress: CharacterWeeklyProgress[]
}

export interface CharacterWeeklyProgress {
    level: number
    progress: number
    threshold: number
}
