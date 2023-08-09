import type { ItemLocation, ItemQuality } from '@/enums'

export interface UserItem {
    appearanceId: number
    appearanceModifier: number
    appearanceSource: string
    context: number
    count: number
    craftedQuality: number
    enchantId: number
    itemId: number
    itemLevel: number
    location: ItemLocation
    quality: ItemQuality
    slot: number
    suffix: number

    bonusIds: number[]
    gems: number[]

    enchantmentIds: number[]
    gemIds: number[]

    containerId: number
    containerName: string
}
