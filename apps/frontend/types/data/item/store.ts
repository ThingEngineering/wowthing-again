import type { ItemDataItem, ItemDataItemArray } from './item'


export interface ItemData {
    items: Record<number, ItemDataItem>

    rawItems: ItemDataItemArray[]
}
