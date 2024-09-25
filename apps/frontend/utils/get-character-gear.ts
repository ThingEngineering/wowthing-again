import { get } from 'svelte/store';

import { Constants } from '@/data/constants';
import {
    heirloomSlots,
    slotOrder,
    specialValidEnchants,
    validEnchants,
} from '@/data/inventory-slot';
import { InventorySlot } from '@/enums/inventory-slot';
import { ItemBonusType } from '@/enums/item-bonus-type';
import { ItemClass } from '@/enums/item-class';
import { WeaponSubclass } from '@/enums/weapon-subclass';
import { itemStore } from '@/stores';
// import getFirstMatch from '@/utils/get-first-match'
import type { GearState } from '@/stores/local-storage';
import type { Character, CharacterGear } from '@/types';

export default function getCharacterGear(state: GearState, character: Character): CharacterGear[] {
    const itemData = get(itemStore);
    const ret: CharacterGear[] = [];

    const highlightAny =
        state.highlightEnchants ||
        state.highlightGems ||
        state.highlightHeirlooms ||
        state.highlightUpgrades;

    for (const inventorySlot of slotOrder) {
        const gear: CharacterGear = {
            equipped: character.equippedItems[inventorySlot],
            highlight: false,
            lowItemLevel: false,
            missingEnchant: false,
            missingGem: false,
            missingHeirloom: false,
            missingUpgrade: false,
            upgradeHas: 0,
            upgradeMax: 0,
        };
        ret.push(gear);

        if (!gear.equipped) {
            continue;
        }

        if (state.highlightHeirlooms && character.level < 70) {
            // Rings are annoying, only need one though
            if (heirloomSlots[inventorySlot] && gear.equipped.quality !== 7) {
                if (
                    !(
                        inventorySlot === InventorySlot.Ring1 &&
                        character.equippedItems[InventorySlot.Ring2]?.quality === 7
                    ) &&
                    !(
                        inventorySlot === InventorySlot.Ring2 &&
                        character.equippedItems[InventorySlot.Ring1]?.quality === 7
                    )
                ) {
                    gear.missingHeirloom = true;
                }
            }
        }

        if (state.highlightItemLevel && gear.equipped.itemLevel < state.minimumItemLevel) {
            gear.lowItemLevel = true;
        }

        if (character.level === Constants.characterMaxLevel && gear.equipped.itemLevel >= 340) {
            if (state.highlightEnchants) {
                let enchants: number[];
                if (inventorySlot === InventorySlot.OffHand) {
                    const equippedItem = itemData.items[gear.equipped.itemId];
                    if (
                        equippedItem.classId === ItemClass.Weapon &&
                        equippedItem.subclassId !== WeaponSubclass.HeldInOffHand &&
                        equippedItem.subclassId !== WeaponSubclass.Shield
                    ) {
                        enchants = validEnchants[InventorySlot.MainHand];
                    }
                } else if (inventorySlot === InventorySlot.Ring2) {
                    enchants = validEnchants[InventorySlot.Ring1];
                }

                if (!enchants) {
                    enchants = validEnchants[inventorySlot];
                }

                if (enchants) {
                    if (!gear.equipped.enchantmentIds.some((e) => enchants.indexOf(e) >= 0)) {
                        gear.missingEnchant = true;
                    }
                }

                const specialEnchants = specialValidEnchants[inventorySlot];
                if (specialEnchants?.checkFunc(character)) {
                    if (
                        !gear.equipped.enchantmentIds.some(
                            (e) => specialEnchants.enchants.indexOf(e) >= 0,
                        )
                    ) {
                        gear.missingEnchant = true;
                    }
                }
            }

            if (state.highlightGems) {
                let gemCount = 0;
                for (const bonusId of gear.equipped.bonusIds) {
                    if (itemData.itemBonusSocket.has(bonusId)) {
                        const itemBonus = itemData.itemBonuses[bonusId];
                        for (const [bonusType, bonusValue1] of itemBonus.bonuses) {
                            if (bonusType === ItemBonusType.AddSockets) {
                                gemCount += bonusValue1;
                            }
                        }
                    }
                }

                if (gemCount > 0) {
                    gear.missingGem = gear.equipped.gemIds.length < gemCount;
                }
            }

            if (state.highlightUpgrades) {
                for (const bonusId of gear.equipped.bonusIds) {
                    if (!itemData.itemBonusCurrentSeason.has(bonusId)) {
                        continue;
                    }

                    const upgradeData = itemData.itemBonusToUpgrade[bonusId];
                    if (upgradeData) {
                        gear.upgradeHas = upgradeData[1];
                        gear.upgradeMax = upgradeData[2];
                        gear.missingUpgrade = upgradeData[1] < upgradeData[2];
                    }
                }
            }
        }

        gear.highlight =
            gear.missingEnchant || gear.missingGem || gear.missingHeirloom || gear.missingUpgrade;
        if (state.highlightItemLevel) {
            if (highlightAny) {
                gear.highlight = gear.highlight && gear.lowItemLevel;
            } else {
                gear.highlight = gear.lowItemLevel;
            }
        }
    }

    return ret;
}
