import { get } from 'svelte/store';

import { ArmorSubclass } from '@/enums/armor-subclass';
import { InventoryType } from '@/enums/inventory-type';
import { ItemClass } from '@/enums/item-class';
import { RewardType } from '@/enums/reward-type';
import { itemStore } from '@/stores';
import { WeaponSubclass } from '@/enums/weapon-subclass';

export function getItemTypeAndSubtype(id: number): [RewardType, number] {
    let type = RewardType.Item;
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
            } else {
                type = RewardType.Armor;
                subType = item.inventoryType === InventoryType.Back ? 0 : item.subclassId;
            }
        } else if (item.classId === ItemClass.Weapon) {
            type = RewardType.Weapon;
            subType = item.subclassId;
        }
    }

    return [type, subType];
}
