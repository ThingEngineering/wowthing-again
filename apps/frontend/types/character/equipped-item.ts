export interface CharacterEquippedItem {
    context: number
    count?: number
    craftedQuality: number
    itemId: number
    itemLevel: number
    quality: number

    bonusIds: number[]
    enchantmentIds: number[]
    gemIds: number[]
}
