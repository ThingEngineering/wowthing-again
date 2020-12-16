import type {Dictionary} from './dictionary'

export class Character {
    name: string
    realmId: number
    faction: number
    gender: number
    raceId: number
    classId: number
    level: number
    equippedItemLevel: number

    accountId?: number

    equippedItems: CharacterEquippedItem[]
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
