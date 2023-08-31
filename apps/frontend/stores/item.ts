import { currentTier, previousTier } from '@/data/gear'
import { WritableFancyStore } from '@/types'
import { ItemDataItem, type ItemData, DataItemBonus } from '@/types/data/item'
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

            for (const appearanceData of (itemArray[16] || [])) {
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

        data.itemBonuses = {}
        for (const itemBonusArray of data.rawItemBonuses) {
            const obj = new DataItemBonus(...itemBonusArray)
            data.itemBonuses[obj.id] = obj
        }
        data.rawItemBonuses = null

        data.appearanceToItems = {}
        for (const [appearanceId, itemIds] of appearanceIds.entries())
        {
            data.appearanceToItems[appearanceId] = Array.from(itemIds)
        }

        data.itemBonusToUpgrade = {}
        for (const bonusGroups of Object.values(data.itemBonusListGroups)) {
            for (const [sharedStringId, itemBonuses] of Object.entries(bonusGroups)) {
                if (itemBonuses.length > 1) {
                    for (let i = 0; i < itemBonuses.length; i++) {
                        const itemBonus = itemBonuses[i]
                        if (data.itemBonusToUpgrade[itemBonus]) {
                            console.log('ruh roh', itemBonus)
                        }
                        data.itemBonusToUpgrade[itemBonus] = [parseInt(sharedStringId), i + 1, itemBonuses.length]
                    }
                }
            }
        }

        console.timeEnd('ItemDataStore.initialize')
    }

    setup(
        manualData: ManualData,
    ) {
        // console.time('ItemDataStore.setup')

        this.update((state) => {
            state.currentTier = {}
            state.previousTier = {}

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
                if (previousTier?.sets[set.name]) {
                    for (const itemIds of set.items) {
                        const item = this.value.items[itemIds[0]]
                        if (previousTier.slots.indexOf(item.inventoryType) >= 0)
                        {
                            state.previousTier[item.id] = item.inventoryType
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
