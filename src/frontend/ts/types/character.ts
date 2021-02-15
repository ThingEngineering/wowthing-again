import type {Dictionary} from './dictionary'

class Character {
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
    raiderIo: CharacterRaiderIo
    reputations: Dictionary<number>
    shadowlands?: CharacterShadowlands
}

class CharacterEquippedItem {
    context: number
    itemId: number
    itemLevel: number
    quality: number

    bonusIds: number[]
    enchantmentIds: number[]
}

class CharacterMythicPlus {
    currentPeriodId: number
    periodRuns: Dictionary<CharacterMythicPlusRun[]>
    seasons: Dictionary<Dictionary<CharacterMythicPlusRun[]>>
}

class CharacterMythicPlusRun {
    affixes: number[]
    completed: string
    dungeonId: number
    duration: number
    keystoneLevel: number
    members: CharacterMythicPlusRunMember[]
    timed: boolean
}

class CharacterMythicPlusRunMember {
    itemLevel: number
    name: string
    realmId: number
    specializationId: number
}

class CharacterRaiderIo {

}

class CharacterShadowlands {
    conduits: number[][]
    covenantId: number
    renownLevel: number
    soulbindId: number
}

export {
    Character,
    CharacterEquippedItem
}
