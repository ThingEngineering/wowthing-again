import type { InventoryType } from '@/enums/inventory-type'
import type { ItemDataItem, ItemDataItemArray } from './item'
import type { DataItemBonus, DataItemBonusArray } from './item-bonus'


export interface ItemData {
    appearanceToItems: Record<number, number[]>
    completesQuest: Record<number, number[]>
    craftingQualities: Record<number, number[]>
    itemBonusToUpgrade: Record<number, [number, number, number]>
    oppositeFactionAppearance: Record<number, number[]>

    currentTier: Record<number, InventoryType>
    previousTier: Record<number, InventoryType>

    itemBonusListGroups: Record<number, Record<number, number[]>>

    items: Record<number, ItemDataItem>
    rawItems: ItemDataItemArray[]

    itemBonuses: Record<number, DataItemBonus>
    rawItemBonuses: DataItemBonusArray[]

    classIdSubclassIdInventoryTypes: [number, number, number][]
    classMasks: number[]
    oppositeFactionIds: number[]
    raceMasks: number[]
    names: string[]
}
