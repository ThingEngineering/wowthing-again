import { Constants } from '@/data/constants';
import { currentTier, previousTier } from '@/data/gear';
import { ItemBonusType } from '@/enums/item-bonus-type';
import { ItemDataItem, DataItemBonus, DataItemSet } from '@/types/data/item';
import { DataItems, type RawItems } from './types';
import { StatType } from '@/enums/stat-type';

export function processItemsData(rawData: RawItems): DataItems {
    console.time('processItemsData');

    const data = new DataItems();

    data.appearanceMap = rawData.appearanceMap;
    data.bonusIdToModifiedCrafting = rawData.bonusIdToModifiedCrafting;
    data.completesQuest = rawData.completesQuest;
    data.itemConversionEntries = rawData.itemConversionEntries;
    data.limitCategories = rawData.limitCategories;
    data.specOverrides = rawData.specOverrides;
    data.teachesSpell = rawData.teachesSpell;
    data.teachesIllusion = rawData.teachesIllusion;
    data.teachesTransmog = rawData.teachesTransmog;

    console.time('rawItems');
    let itemId = 0;
    for (const itemArray of rawData.rawItems) {
        itemId += itemArray[0];
        const [classId, subclassId, inventoryType] =
            rawData.classIdSubclassIdInventoryTypes[itemArray[4]];
        const obj = new ItemDataItem(
            itemId,
            rawData.names[itemArray[1]],
            rawData.classMasks[itemArray[2]],
            rawData.raceMasks[itemArray[3]],
            classId,
            subclassId,
            inventoryType,
            ...itemArray
        );
        data.items[obj.id] = obj;

        for (const appearanceData of itemArray[13] || []) {
            if (appearanceData[0] > 0) {
                const appItems = (data.appearanceToItems[appearanceData[0]] ||= []);
                appItems.push([itemId, appearanceData[2] || 0]);
            }
        }

        if (obj.openable && obj.expansion === Constants.expansion) {
            data.openableItemIds.add(obj.id);
        }
    }
    console.timeEnd('rawItems');

    for (const [craftingQuality, itemIds] of Object.entries(rawData.craftingQualities)) {
        const quality = parseInt(craftingQuality);
        for (const itemId of itemIds) {
            data.items[itemId].craftingQuality = quality;
        }
    }

    for (const [limitCategory, itemIds] of Object.entries(rawData.limitCategoryItems)) {
        const category = parseInt(limitCategory);
        for (const itemId of itemIds) {
            data.items[itemId].limitCategory = category;
        }
    }

    data.oppositeFactionAppearance = {};
    for (let i = 0; i < rawData.oppositeFactionIds.length; i += 2) {
        const itemId1 = rawData.oppositeFactionIds[i];
        const itemId2 = rawData.oppositeFactionIds[i + 1];
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

    for (const itemBonusArray of rawData.rawItemBonuses) {
        const obj = new DataItemBonus(...itemBonusArray);
        data.itemBonuses[obj.id] = obj;

        if (obj.bonuses[0][0] === ItemBonusType.AddSockets && obj.bonuses[0][2] === 7) {
            data.itemBonusSocket.add(obj.id);
        } else if (
            obj.bonuses[0][0] === ItemBonusType.IncreaseBonusStat &&
            obj.bonuses[0][1] === StatType.SpeedRating
        ) {
            data.itemBonusSpeed.add(obj.id);
        } else if (
            obj.bonuses[0][0] === ItemBonusType.ItemBonusListGroupId &&
            Constants.seasonItemBonusListGroups.indexOf(obj.bonuses[0][1]) >= 0
        ) {
            data.itemBonusCurrentSeason.add(obj.id);
        } else if (obj.bonuses[0][0] === ItemBonusType.ItemConversionId) {
            data.itemConversionBonus[obj.id] = obj.bonuses[0][1];
        }
    }

    for (const bonusGroups of Object.values(rawData.itemBonusListGroups)) {
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

    for (const itemSetArray of rawData.rawItemSets) {
        const obj = new DataItemSet(...itemSetArray);
        data.itemSets[obj.id] = obj;
    }

    for (const [itemIdString, transmogSetId] of Object.entries(rawData.teachesTransmog)) {
        (data.transmogSetToItems[transmogSetId] ||= []).push(parseInt(itemIdString));
    }

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

    console.timeEnd('processItemsData');

    return data;
}
