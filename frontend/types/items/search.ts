import type { ItemLocation, ItemQuality } from '@/types/enums'


export interface ItemSearchResponseItem {
    itemId: number
    itemName: string
    characters: ItemSearchResponseCharacter[]
}

export interface ItemSearchResponseCharacter {
    characterId: number
    count: number
    location: ItemLocation
    itemLevel: number
    quality: ItemQuality
    context?: number
    enchantId?: number
    suffixId?: number
    bonusIds?: number[]
    gems?: number[]
}
