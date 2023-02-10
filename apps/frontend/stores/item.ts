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

        const appearanceIds = new Map<number, Set<number>>()

        data.items = {}
        for (const itemArray of data.rawItems) {
            const obj = new ItemDataItem(...itemArray)
            data.items[obj.id] = obj

            for (const appearanceData of (itemArray[15] || [])) {
                let appSet = appearanceIds.get(appearanceData[1])
                if (!appSet)
                {
                    appSet = new Set<number>()
                    appearanceIds.set(appearanceData[1], appSet)
                }
                appSet.add(itemArray[0])
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

    setup(
        manualData: ManualData,
    ) {
        // console.time('ItemDataStore.setup')

        this.update((state) => {
            state.currentTier = {}

            for (const set of manualData.shared.itemSets) {
                if (currentTier.sets[set.name]) {
                    for (const itemIds of set.items) {
                        const item = this.value.items[itemIds[0]]
                        if (currentTier.slots.indexOf(item.inventoryType) >= 0)
                        {
                            state.currentTier[item.id] = item.inventoryType
                        }
                    }
                }
            }

            return state
        })

        // console.timeEnd('ItemDataStore.setup')
    }
}

export const itemStore = new ItemDataStore()
