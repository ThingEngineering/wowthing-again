import type { ItemLocation, ItemQuality } from '@/enums'


export interface ItemSearchResponseItem {
    itemId: number
    itemName: string
    characters: ItemSearchResponseCharacter[]
    equipped: ItemSearchResponseCharacter[]
    guildBanks: ItemSearchResponseGuildBank[]
}

export interface ItemSearchResponseCommon {
    count: number
    itemLevel: number
    quality: ItemQuality
    context?: number
    enchantId?: number
    suffixId?: number
    bonusIds?: number[]
    gems?: number[]
}

export interface ItemSearchResponseCharacter extends ItemSearchResponseCommon {
    characterId: number
    location: ItemLocation
}

export interface ItemSearchResponseGuildBank extends ItemSearchResponseCommon {
    guildId: number
    tab: number
    slot: number
}
