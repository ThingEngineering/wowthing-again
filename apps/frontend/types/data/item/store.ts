import type { InventoryType } from '@/enums'
import type { ItemDataItem, ItemDataItemArray } from './item'
import type { DataItemBonus, DataItemBonusArray } from './item-bonus'


export interface ItemData {
    appearanceToItems: Record<number, number[]>
    itemBonusToUpgrade: Record<number, [number, number, number]>

    currentTier: Record<number, InventoryType>
    previousTier: Record<number, InventoryType>

    itemBonusListGroups: Record<number, Record<number, number[]>>

    items: Record<number, ItemDataItem>
    rawItems: ItemDataItemArray[]

    itemBonuses: Record<number, DataItemBonus>
    rawItemBonuses: DataItemBonusArray[]
}
