import type {Dictionary} from './dictionary'

class Character {
    name: string
    realmId: number
    faction: number
    gender: number
    raceId: number
    classId: number
    level: number
    equippedItemLevel: number
    calculatedItemLevel: string

    accountId?: number

    equippedItems: Dictionary<CharacterEquippedItem>
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
