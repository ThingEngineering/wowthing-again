import type { InventoryType } from '@/enums'
import type { ItemDataItem, ItemDataItemArray } from './item'


export interface ItemData {
    appearanceToItems: Record<number, number[]>
    currentTier: Record<number, InventoryType>
    items: Record<number, ItemDataItem>

    rawItems: ItemDataItemArray[]
}
