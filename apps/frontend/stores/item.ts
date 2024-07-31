import { Constants } from '@/data/constants';
import { currentTier, previousTier } from '@/data/gear';
import { WritableFancyStore } from '@/types/fancy-store';
import { ItemDataItem, type ItemData, DataItemBonus, DataItemSet } from '@/types/data/item';

export class ItemDataStore extends WritableFancyStore<ItemData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-item');
    }

    initialize(data: ItemData) {
        console.time('ItemDataStore.initialize');

        data.appearanceToItems = {};
        data.items = {};
        let itemId = 0;
        for (const itemArray of data.rawItems) {
            itemId += itemArray[0];
            const [classId, subclassId, inventoryType] =
                data.classIdSubclassIdInventoryTypes[itemArray[4]];
            const obj = new ItemDataItem(
                itemId,
                data.names[itemArray[1]],
                data.classMasks[itemArray[2]],
                data.raceMasks[itemArray[3]],
                classId,
                subclassId,
                inventoryType,
                ...itemArray,
            );
            data.items[obj.id] = obj;

            for (const appearanceData of itemArray[12] || []) {
                if (appearanceData[0] > 0) {
                    const appItems = (data.appearanceToItems[appearanceData[0]] ||= []);
                    appItems.push([itemId, appearanceData[2] || 0]);
                }
            }
        }
        data.rawItems = null;

        for (const [craftingQuality, itemIds] of Object.entries(data.craftingQualities)) {
            const quality = parseInt(craftingQuality);
            for (const itemId of itemIds) {
                data.items[itemId].craftingQuality = quality;
            }
        }

        for (const [limitCategory, itemIds] of Object.entries(data.limitCategoryItems)) {
            const category = parseInt(limitCategory);
            for (const itemId of itemIds) {
                data.items[itemId].limitCategory = category;
            }
        }

        data.oppositeFactionAppearance = {};
        for (let i = 0; i < data.oppositeFactionIds.length; i += 2) {
            const itemId1 = data.oppositeFactionIds[i];
            const itemId2 = data.oppositeFactionIds[i + 1];
            const item1 = data.items[itemId1];
            const item2 = data.items[itemId2];
            if (item1 && item2) {
                item1.oppositeFactionId = itemId2;
                item2.oppositeFactionId = itemId1;

                if (item1.appearances && item2.appearances) {
                    for (const [key, appearance] of Object.entries(item1.appearances)) {
                        const otherAppearance = item2.appearances[parseInt(key)];
                        if (otherAppearance) {
                            for (const [a, b] of [
                                [appearance, otherAppearance],
                                [otherAppearance, appearance],
                            ]) {
                                const ofa = (data.oppositeFactionAppearance[a.appearanceId] ||= []);
                                if (ofa.indexOf(b.appearanceId) === -1) {
                                    ofa.push(b.appearanceId);
                                }
                            }
                        }
                    }
                }
            }
        }

        data.itemBonuses = {};
        data.itemBonusCurrentSeason = new Set<number>();
        data.itemConversionBonus = {};
        for (const itemBonusArray of data.rawItemBonuses) {
            const obj = new DataItemBonus(...itemBonusArray);
            data.itemBonuses[obj.id] = obj;

            if (
                obj.bonuses[0][0] === 34 &&
                Constants.seasonItemBonusListGroups.indexOf(obj.bonuses[0][1]) >= 0
            ) {
                data.itemBonusCurrentSeason.add(obj.id);
            }
            // Set ItemConversionID
            else if (obj.bonuses[0][0] === 37) {
                data.itemConversionBonus[obj.id] = obj.bonuses[0][1];
            }
        }
        data.rawItemBonuses = null;

        data.itemBonusToUpgrade = {};
        for (const bonusGroups of Object.values(data.itemBonusListGroups)) {
            for (const [sharedStringId, itemBonuses] of Object.entries(bonusGroups)) {
                if (itemBonuses.length > 1) {
                    for (let i = 0; i < itemBonuses.length; i++) {
                        const itemBonus = itemBonuses[i];
                        if (data.itemBonusToUpgrade[itemBonus]) {
                            console.log('ruh roh', itemBonus);
                        }
                        data.itemBonusToUpgrade[itemBonus] = [
                            parseInt(sharedStringId),
                            i + 1,
                            itemBonuses.length,
                        ];
                    }
                }
            }
        }

        data.itemSets = {};
        for (const itemSetArray of data.rawItemSets) {
            const obj = new DataItemSet(...itemSetArray);
            data.itemSets[obj.id] = obj;
        }
        data.rawItemSets = null;

        data.currentTier = {};
        for (const itemSetId of currentTier) {
            const itemSet = data.itemSets[itemSetId];
            for (const itemId of itemSet.itemIds) {
                const item = data.items[itemId];
                data.currentTier[item.id] = item.inventoryType;
            }
        }

        data.previousTier = {};
        for (const itemSetId of previousTier) {
            const itemSet = data.itemSets[itemSetId];
            for (const itemId of itemSet.itemIds) {
                const item = data.items[itemId];
                data.previousTier[item.id] = item.inventoryType;
            }
        }

        console.timeEnd('ItemDataStore.initialize');
    }
}

export const itemStore = new ItemDataStore();
