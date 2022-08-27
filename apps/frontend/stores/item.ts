import { WritableFancyStore } from '@/types'
import { ItemDataItem, type ItemData } from '@/types/data/item'


export class ItemDataStore extends WritableFancyStore<ItemData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-item')
    }

    initialize(data: ItemData) {
        // console.time('ItemDataStore.initialize')

        data.items = {}
        for (const itemArray of data.rawItems) {
            const obj = new ItemDataItem(...itemArray)
            data.items[obj.id] = obj
        }
        data.rawItems = null

        // console.timeEnd('ItemDataStore.initialize')
    }
}

export const itemStore = new ItemDataStore()
