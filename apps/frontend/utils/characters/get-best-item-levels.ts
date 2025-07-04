import { specializationData } from '@/data/character-specialization';
import { slotOrder } from '@/data/inventory-slot';
import { bestTypeOrder } from '@/data/inventory-type';
import { InventoryType, weaponInventoryTypes } from '@/enums/inventory-type';
import { ItemLocation } from '@/enums/item-location';
import { PrimaryStat, primaryStatToStats } from '@/enums/primary-stat';
import {
    offHandWeaponSubclasses,
    oneHandWeaponSubclasses,
    twoHandWeaponSubclasses,
} from '@/enums/weapon-subclass';
import { wowthingData } from '@/shared/stores/data';
import type { Character } from '@/types/character';
import type { ItemDataItem } from '@/types/data/item';

type BestItemLevels = Record<number, [string, InventoryType[]]>;

export function getBestItemLevels(character: Character): BestItemLevels {
    const ret: BestItemLevels = {};

    const specializations = wowthingData.static.characterSpecializationsByClassId.get(
        character.classId
    );
    for (const specialization of specializations) {
        const bestItemLevels: Record<number, [ItemDataItem, number][]> = {};
        const missingSlots: InventoryType[] = [];
        const primaryStats = primaryStatToStats[specialization.primaryStat];

        for (const locationItem of character.itemsByLocation.get(ItemLocation.Bags)) {
            const item = wowthingData.items.items[locationItem.itemId];
            if (!item) {
                continue;
            }

            const invType = item?.inventoryType;
            if (!bestTypeOrder.includes(invType) && !weaponInventoryTypes.has(invType)) {
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

            const item = wowthingData.items.items[equippedItem.itemId];
            if (!item) {
                continue;
            }

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
        for (const inventoryType of bestTypeOrder) {
            const bestForType = bestItemLevels[inventoryType] || [];
            count++;

            bestForType.sort((a, b) => b[1] - a[1]);
            if ([InventoryType.Finger, InventoryType.Trinket].includes(inventoryType)) {
                // Rings and Trinkets cover 2 slots and may have unique-equipped to worry about
                count++;
                const seenCategory: Record<number, number> = {};

                let found = 0;
                for (const [item, itemLevel] of bestForType) {
                    // console.log(
                    //     inventoryType,
                    //     itemLevel,
                    //     seenCategory[item.limitCategory],
                    //     wowthingData.items.limitCategories[item.limitCategory],
                    // );
                    if (
                        !item.limitCategory ||
                        (seenCategory[item.limitCategory] || 0) <
                            wowthingData.items.limitCategories[item.limitCategory]
                    ) {
                        found++;
                        if (item.limitCategory) {
                            seenCategory[item.limitCategory] =
                                (seenCategory[item.limitCategory] || 0) + 1;
                        }

                        levels += itemLevel;

                        if (found === 2) {
                            break;
                        }
                    }
                }
            } else {
                // console.log(inventoryType, InventoryType[inventoryType], bestForType[0]?.[1]);

                const bestItemLevel = bestForType[0]?.[1] || 0;
                levels += bestItemLevel;
                if (bestItemLevel === 0) {
                    missingSlots.push(inventoryType);
                }
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
                if (
                    !specData.weaponTypes.includes(item.subclassId) &&
                    !specData.weaponTypesOffhand?.includes(item.subclassId)
                ) {
                    continue;
                }

                if (
                    offHandWeaponSubclasses.has(item.subclassId) ||
                    specData.weaponTypesOffhand?.includes(item.subclassId)
                ) {
                    weaponsByType.offHand.push([item, itemLevel]);
                } else if (oneHandWeaponSubclasses.has(item.subclassId)) {
                    weaponsByType.oneHand.push([item, itemLevel]);
                } else if (twoHandWeaponSubclasses.has(item.subclassId)) {
                    weaponsByType.twoHand.push([item, itemLevel]);
                } else {
                    console.log('wtf is it then?', item.subclassId);
                }
            }
        }

        for (const weapons of Object.values(weaponsByType)) {
            weapons.sort((a, b) => b[1] - a[1]);
        }

        count += 2;
        const weaponSetups: number[] = [];
        if (specData.dualWield === true) {
            // TODO unique-equipped weapons? ew
            weaponSetups.push(
                (weaponsByType.oneHand[0]?.[1] || 0) + (weaponsByType.oneHand[1]?.[1] || 0)
            );

            if (specialization.id === 72) {
                // Fury can dual-wield 2h
                weaponSetups.push(
                    (weaponsByType.twoHand[0]?.[1] || 0) + (weaponsByType.twoHand[1]?.[1] || 0)
                );
            } else if (specialization.id === 260) {
                // Outlaw dagger off-hands
                weaponSetups.push(
                    (weaponsByType.oneHand[0]?.[1] || 0) + (weaponsByType.offHand[0]?.[1] || 0)
                );
            } else {
                weaponSetups.push((weaponsByType.twoHand[0]?.[1] || 0) * 2);
            }
        } else {
            weaponSetups.push(
                (weaponsByType.oneHand[0]?.[1] || 0) + (weaponsByType.offHand[0]?.[1] || 0)
            );
            weaponSetups.push((weaponsByType.twoHand[0]?.[1] || 0) * 2);
        }
        levels += Math.max(...weaponSetups);

        ret[specialization.id] = [(levels / count).toFixed(1), missingSlots];

        // console.log(character.name, specialization.id, specialization.name, bestItemLevels);
    }

    return ret;
}
