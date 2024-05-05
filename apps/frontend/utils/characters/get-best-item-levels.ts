import { get } from 'svelte/store';

import { specializationData } from '@/data/character-specialization';
import { slotOrder } from '@/data/inventory-slot';
import { typeOrder } from '@/data/inventory-type';
import { InventoryType, weaponInventoryTypes } from '@/enums/inventory-type';
import { ItemLocation } from '@/enums/item-location';
import { PrimaryStat, primaryStatToStats } from '@/enums/primary-stat';
import {
    offHandWeaponSubclasses,
    oneHandWeaponSubclasses,
    twoHandWeaponSubclasses,
} from '@/enums/weapon-subclass';
import { staticStore } from '@/shared/stores/static';
import { itemStore } from '@/stores';
import type { Character } from '@/types/character';
import type { ItemDataItem } from '@/types/data/item';

export function getBestItemLevels(character: Character): Record<number, string> {
    const ret: Record<number, string> = {};

    const itemData = get(itemStore);
    const staticData = get(staticStore);

    const specializations = Object.values(staticData.characterSpecializations).filter(
        (spec) => spec.classId === character.classId,
    );
    for (const specialization of specializations) {
        const bestItemLevels: Record<number, [ItemDataItem, number][]> = {};
        const primaryStats = primaryStatToStats[specialization.primaryStat];

        for (const locationItem of character.itemsByLocation[ItemLocation.Bags] || []) {
            const item = itemData.items[locationItem.itemId];
            const invType = item?.inventoryType;
            if (!typeOrder.includes(invType) && !weaponInventoryTypes.has(invType)) {
                continue;
            }

            if (item.primaryStat === PrimaryStat.None || primaryStats.includes(item.primaryStat)) {
                const sighInventoryType =
                    item.inventoryType === InventoryType.Chest2
                        ? InventoryType.Chest
                        : item.inventoryType;
                (bestItemLevels[sighInventoryType] ||= []).push([item, locationItem.itemLevel]);
            }
        }

        for (const slot of slotOrder) {
            const equippedItem = character.equippedItems[slot];
            if (equippedItem === undefined) {
                continue;
            }

            const item = itemData.items[equippedItem.itemId];
            if (item.primaryStat === PrimaryStat.None || primaryStats.includes(item.primaryStat)) {
                const sighInventoryType =
                    item.inventoryType === InventoryType.Chest2
                        ? InventoryType.Chest
                        : item.inventoryType;
                (bestItemLevels[sighInventoryType] ||= []).push([item, equippedItem.itemLevel]);
            }
        }

        let count = 0;
        let levels = 0;
        for (const inventoryType of typeOrder) {
            if (
                [InventoryType.Chest2, InventoryType.Tabard].includes(inventoryType) ||
                weaponInventoryTypes.has(inventoryType)
            ) {
                continue;
            }

            const bestForType = bestItemLevels[inventoryType] || [];
            count++;

            bestForType.sort((a, b) => b[1] - a[1]);
            if ([InventoryType.Finger, InventoryType.Trinket].includes(inventoryType)) {
                // Rings and Trinkets cover 2 slots and may have unique-equipped to worry about
                count++;
                const seenCategory: Record<number, number> = {};

                let found = 0;
                for (const [item, itemLevel] of bestForType) {
                    if (
                        !item.limitCategory ||
                        (seenCategory[item.limitCategory] || 0) <
                            itemData.limitCategories[item.limitCategory]
                    ) {
                        found++;
                        seenCategory[item.limitCategory] =
                            (seenCategory[item.limitCategory] || 0) + 1;

                        levels += itemLevel;

                        if (found === 2) {
                            break;
                        }
                    }
                }
            } else {
                levels += bestForType[0]?.[1] || 0;
            }
        }

        // Weapons, oh joy
        const specData = specializationData[specialization.id];
        const weaponsByType: Record<string, [ItemDataItem, number][]> = {
            offHand: [],
            oneHand: [],
            twoHand: [],
        };
        for (const inventoryType of weaponInventoryTypes) {
            const bestForType = bestItemLevels[inventoryType];
            if (!bestForType) {
                continue;
            }

            for (const [item, itemLevel] of bestForType) {
                if (!specData.weaponTypes.includes(item.subclassId)) {
                    continue;
                }

                if (offHandWeaponSubclasses.has(item.subclassId)) {
                    weaponsByType.offHand.push([item, itemLevel]);
                } else if (oneHandWeaponSubclasses.has(item.subclassId)) {
                    weaponsByType.oneHand.push([item, itemLevel]);
                } else if (twoHandWeaponSubclasses.has(item.subclassId)) {
                    weaponsByType.twoHand.push([item, itemLevel]);
                }
            }
        }

        for (const weapons of Object.values(weaponsByType)) {
            weapons.sort((a, b) => b[1] - a[1]);
        }

        count += 2;
        if (specData.dualWield === true) {
            // TODO unique-equipped weapons? ew
            const bestOneOne =
                (weaponsByType.oneHand[0]?.[1] || 0) + (weaponsByType.oneHand[1]?.[1] || 0);
            const bestTwoTwo =
                specialization.id === 72
                    ? (weaponsByType.twoHand[0]?.[1] || 0) + (weaponsByType.twoHand[1]?.[1] || 0)
                    : 0;
            levels += Math.max(bestOneOne, bestTwoTwo);
        } else {
            const bestOneOff =
                (weaponsByType.oneHand[0]?.[1] || 0) + (weaponsByType.offHand[0]?.[1] || 0);
            const bestTwo = (weaponsByType.twoHand[0]?.[1] || 0) * 2;
            levels += Math.max(bestOneOff, bestTwo);
        }

        ret[specialization.id] = (levels / count).toFixed(1);
    }

    return ret;
}
