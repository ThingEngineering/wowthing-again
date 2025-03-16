import { get } from 'svelte/store';

import { ArmorSubclass } from '@/enums/armor-subclass';
import { InventoryType } from '@/enums/inventory-type';
import { ItemClass } from '@/enums/item-class';
import { RewardType } from '@/enums/reward-type';
import { itemStore } from '@/stores';
import { WeaponSubclass } from '@/enums/weapon-subclass';

export function getItemTypeAndSubtype(id: number, initialType: RewardType): [RewardType, number] {
    let type = initialType;
    let subType = 0;

    const item = get(itemStore).items[id];
    if (item) {
        if (item.classId === ItemClass.Armor) {
            if (
                item.subclassId === ArmorSubclass.Shield ||
                item.inventoryType === InventoryType.HeldInOffHand
            ) {
                type = RewardType.Weapon;
                subType =
                    item.subclassId === ArmorSubclass.Shield
                        ? WeaponSubclass.Shield
                        : WeaponSubclass.HeldInOffHand;
            } else if (
                item.subclassId === ArmorSubclass.Misc ||
                item.subclassId === ArmorSubclass.Cosmetic ||
                item.subclassId === ArmorSubclass.Tabard ||
                ((item.subclassId < 0 || item.subclassId > 4) && item.cosmetic)
            ) {
                type = RewardType.Cosmetic;
            } else if ((item.subclassId >= 1 && item.subclassId <= 4) || item.subclassId === 20) {
                type = RewardType.Armor;
                subType = item.inventoryType === InventoryType.Back ? 0 : item.subclassId;
            } else {
                console.log('wtf?', item);
            }
        } else if (item.classId === ItemClass.Weapon) {
            type = RewardType.Weapon;
            subType = item.subclassId;
        }
    }

    return [type, subType];
}
