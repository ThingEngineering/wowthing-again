import { Constants } from '@/data/constants'
import { currentTier, previousTier } from '@/data/gear'
import { WritableFancyStore } from '@/types/fancy-store'
import { ItemDataItem, type ItemData, DataItemBonus, DataItemSet } from '@/types/data/item'
import type { ManualData } from '@/types/data/manual'
import type { StaticData } from '@/shared/stores/static/types'


export class ItemDataStore extends WritableFancyStore<ItemData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-item')
    }

    initialize(data: ItemData) {
        console.time('ItemDataStore.initialize')

        const appearanceIds = new Map<number, Set<number>>()

        data.items = {}
        let itemId = 0;
        for (const itemArray of data.rawItems) {
            itemId += itemArray[0];
            const [classId, subclassId, inventoryType] = data.classIdSubclassIdInventoryTypes[itemArray[4]]
            const obj = new ItemDataItem(
                itemId,
                data.names[itemArray[1]],
                data.classMasks[itemArray[2]],
                data.raceMasks[itemArray[3]],
                classId,
                subclassId,
                inventoryType,
                ...itemArray
            )
            data.items[obj.id] = obj

            for (const appearanceData of (itemArray[10] || [])) {
                let appSet = appearanceIds.get(appearanceData[0])
                if (!appSet)
                {
                    appSet = new Set<number>()
                    appearanceIds.set(appearanceData[0], appSet)
                }
                appSet.add(itemId)
            }
        }
        data.rawItems = null

        for (const [craftingQuality, itemIds] of Object.entries(data.craftingQualities)) {
            const quality = parseInt(craftingQuality)
            for (const itemId of itemIds) {
                data.items[itemId].craftingQuality = quality
            }
        }

        for (const [limitCategory, itemIds] of Object.entries(data.limitCategories)) {
            const category = parseInt(limitCategory)
            for (const itemId of itemIds) {
                data.items[itemId].limitCategory = category
            }
        }

        data.appearanceToItems = {}
        for (const [appearanceId, itemIds] of appearanceIds.entries())
        {
            data.appearanceToItems[appearanceId] = Array.from(itemIds)
        }

        data.oppositeFactionAppearance = {}
        for (let i = 0; i < data.oppositeFactionIds.length; i += 2) {
            const itemId1 = data.oppositeFactionIds[i]
            const itemId2 = data.oppositeFactionIds[i + 1]
            const item1 = data.items[itemId1]
            const item2 = data.items[itemId2]
            if (item1 && item2) {
                item1.oppositeFactionId = itemId2
                item2.oppositeFactionId = itemId1

                if (item1.appearances && item2.appearances) {
                    for (const [key, appearance] of Object.entries(item1.appearances)) {
                        const otherAppearance = item2.appearances[parseInt(key)]
                        if (otherAppearance) {
                            for (const [a, b] of [[appearance, otherAppearance], [otherAppearance, appearance]]) {
                                const ofa = data.oppositeFactionAppearance[a.appearanceId] ||= []
                                if (ofa.indexOf(b.appearanceId) === -1) {
                                    ofa.push(b.appearanceId)
                                }
                            }
                        }
                    }
                }
            }
        }

        data.itemBonuses = {}
        data.itemBonusCurrentSeason = new Set<number>()
        data.itemConversionBonus = {}
        for (const itemBonusArray of data.rawItemBonuses) {
            const obj = new DataItemBonus(...itemBonusArray)
            data.itemBonuses[obj.id] = obj

            if (obj.bonuses[0][0] === 34 &&
                Constants.seasonItemBonusListGroups.indexOf(obj.bonuses[0][1]) >= 0)
            {
                data.itemBonusCurrentSeason.add(obj.id)
            }
            // Set ItemConversionID
            else if (obj.bonuses[0][0] === 37) {
                data.itemConversionBonus[obj.id] = obj.bonuses[0][1]
            }
        }
        data.rawItemBonuses = null

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

        data.itemSets = {}
        for (const itemSetArray of data.rawItemSets) {
            const obj = new DataItemSet(...itemSetArray)
            data.itemSets[obj.id] = obj
        }
        data.rawItemSets = null

        console.timeEnd('ItemDataStore.initialize')
    }

    setup(
        manualData: ManualData,
        staticData: StaticData
    ) {
        // console.time('ItemDataStore.setup')

        this.update((state) => {
            state.currentTier = {}
            state.previousTier = {}

            for (const setName of Object.keys(currentTier.sets)) {
                const setId = parseInt(setName.split(':')[1])
                const transmogSet = staticData.transmogSets[setId]
                for (const [itemId,] of transmogSet.items) {
                    const item = state.items[itemId]
                    if (currentTier.slots.indexOf(item.inventoryType) >= 0) {
                        state.currentTier[item.id] = item.inventoryType
                    }
                }
            }

            for (const setName of Object.keys(previousTier.sets)) {
                const setId = parseInt(setName.split(':')[1])
                const transmogSet = staticData.transmogSets[setId]
                for (const [itemId,] of transmogSet.items) {
                    const item = state.items[itemId]
                    if (previousTier.slots.indexOf(item.inventoryType) >= 0) {
                        state.previousTier[item.id] = item.inventoryType
                    }
                }
            }

            return state
        })

        // console.timeEnd('ItemDataStore.setup')
    }
}

export const itemStore = new ItemDataStore()
