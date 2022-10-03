import type { ItemDataItem, ItemDataItemArray } from './item'


export interface ItemData {
    appearanceToItems: Record<number, number[]>
    items: Record<number, ItemDataItem>

    rawItems: ItemDataItemArray[]
}
