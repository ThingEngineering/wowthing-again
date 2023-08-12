import type { ItemLocation, ItemQuality } from '@/enums'

export interface UserItem {
    appearanceId: number
    appearanceModifier: number
    appearanceSource: string
    context: number
    count: number
    craftedQuality: number
    itemId: number
    itemLevel: number
    location: ItemLocation
    quality: ItemQuality
    slot: number
    suffix: number

    bonusIds: number[]
    enchantmentIds: number[]
    gemIds: number[]

    containerId: number
    containerName: string
}
