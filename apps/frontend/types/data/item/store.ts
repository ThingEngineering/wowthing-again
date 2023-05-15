import type { InventoryType } from '@/enums'
import type { ItemDataItem, ItemDataItemArray } from './item'


export interface ItemData {
    appearanceToItems: Record<number, number[]>
    items: Record<number, ItemDataItem>

    currentTier: Record<number, InventoryType>
    previousTier: Record<number, InventoryType>

    rawItems: ItemDataItemArray[]
}
