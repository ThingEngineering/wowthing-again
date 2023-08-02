import type { InventoryType } from '@/enums'
import type { ItemDataItem, ItemDataItemArray } from './item'


export interface ItemData {
    appearanceToItems: Record<number, number[]>
    itemBonusToUpgrade: Record<number, [number, number, number]>
    items: Record<number, ItemDataItem>

    currentTier: Record<number, InventoryType>
    previousTier: Record<number, InventoryType>

    itemBonusListGroups: Record<number, Record<number, number[]>>
    rawItems: ItemDataItemArray[]
}
