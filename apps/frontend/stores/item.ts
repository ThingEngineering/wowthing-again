import { currentTier } from '@/data/gear'
import { WritableFancyStore } from '@/types'
import { ItemDataItem, type ItemData } from '@/types/data/item'
import type { ManualData } from '@/types/data/manual'


export class ItemDataStore extends WritableFancyStore<ItemData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-item')
    }

    initialize(data: ItemData) {
        console.time('ItemDataStore.initialize')

        //const appearanceIds: Record<number, Record<number, boolean>> = {}
        const appearanceIds = new Map<number, Set<number>>()

        data.items = {}
        for (const itemArray of data.rawItems) {
            const obj = new ItemDataItem(...itemArray)
            data.items[obj.id] = obj

            for (const appearance of Object.values(obj.appearances)) {
                let appSet = appearanceIds.get(appearance.appearanceId)
                if (!appSet)
                {
                    appSet = new Set<number>()
                    appearanceIds.set(appearance.appearanceId, appSet)
                }
                appSet.add(obj.id)
            }
        }
        data.rawItems = null

        data.appearanceToItems = {}
        for (const [appearanceId, itemIds] of appearanceIds.entries())
        {
            data.appearanceToItems[appearanceId] = Array.from(itemIds)
        }

        console.timeEnd('ItemDataStore.initialize')
    }
}

export const itemStore = new ItemDataStore()
