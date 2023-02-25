import some from 'lodash/some'
import { get } from 'svelte/store'

import { Constants } from '@/data/constants'
import { ratingItemLevelUpgrade } from '@/data/dungeon'
import {
    gemBonusIds,
    heirloomSlots,
    slotOrder,
    specialValidEnchants,
    validEnchants,
} from '@/data/inventory-slot'
import { InventorySlot, ItemClass, WeaponSubclass } from '@/enums'
import { itemStore } from '@/stores'
import getFirstMatch from '@/utils/get-first-match'
import type { GearState } from '@/stores/local-storage'
import type { Character, CharacterGear } from '@/types'


export default function getCharacterGear(
    state: GearState,
    character: Character
): CharacterGear[] {
    const itemData = get(itemStore)
    const ret: CharacterGear[] = []

    for (const inventorySlot of slotOrder) {
        const gear: CharacterGear = {
            equipped: character.equippedItems[inventorySlot],
            highlight: false,
            missingEnchant: false,
            missingGem: false,
            missingHeirloom: false,
            missingUpgrade: false,
            upgradeHas: 0,
            upgradeMax: 0,
        }
        ret.push(gear)

        if (!gear.equipped) {
            continue
        }

        if (state.highlightHeirlooms && character.level < (Constants.characterMaxLevel - 10)) {
            if (heirloomSlots[inventorySlot] && gear.equipped.quality !== 7) {
                gear.missingHeirloom = true
            }
        }

        if (character.level === Constants.characterMaxLevel && gear.equipped.itemLevel >= 340) {
            if (state.highlightEnchants) {
                let enchants: number[]
                if (inventorySlot === InventorySlot.OffHand) {
                    const equippedItem = itemData.items[gear.equipped.itemId]
                    if (
                        equippedItem.classId === ItemClass.Weapon &&
                        equippedItem.subclassId !== WeaponSubclass.HeldInOffHand &&
                        equippedItem.subclassId !== WeaponSubclass.Shield
                    ) {
                        enchants = validEnchants[InventorySlot.MainHand]
                    }
                }
                else if (inventorySlot === InventorySlot.Ring2) {
                    enchants = validEnchants[InventorySlot.Ring1]
                }

                if (!enchants) {
                    enchants = validEnchants[inventorySlot]
                }

                if (enchants) {
                    if (!some(gear.equipped.enchantmentIds, (e) => enchants.indexOf(e) >= 0)) {
                        gear.missingEnchant = true
                    }
                }

                const specialEnchants = specialValidEnchants[inventorySlot]
                if (specialEnchants?.checkFunc(character)) {
                    if (!some(gear.equipped.enchantmentIds, (e) => specialEnchants.enchants.indexOf(e) >= 0)) {
                        gear.missingEnchant = true
                    }
                }
            }

            if (state.highlightGems) {
                // TODO fix this once item bonus data available in frontend
                if (some(gear.equipped.bonusIds, (b) => gemBonusIds.indexOf(b) >= 0)) {
                    if (gear.equipped.bonusIds.indexOf(8781) >= 0) {
                        gear.missingGem = gear.equipped.gemIds.length < 2
                    }
                    else if (gear.equipped.bonusIds.indexOf(8782) >= 0) {
                        gear.missingGem = gear.equipped.gemIds.length < 3
                    }
                    else {
                        gear.missingGem = gear.equipped.gemIds.length < 1
                    }
                }
            }

            // 241 = 8189-8202
            // 240 = 8203-8216
            // 246 = 8217-8230
            // 242 = 8231-8244
            // 243 = 8245-8258
            // 245 = 8259-8272
            // 244 = 8273-8286
            if (state.highlightUpgrades) {
                if (some(gear.equipped.bonusIds, (b) => b >= 8961 && b <= 8972)) {
                    gear.upgradeHas = Math.round((gear.equipped.itemLevel - 376) / 3.33)
                    gear.upgradeMax = 13

                    const score = character.mythicPlusSeasonScores[Constants.mythicPlusSeason] || 0
                    const maxUpgrade = getFirstMatch(ratingItemLevelUpgrade, score)

                    gear.missingUpgrade = (gear.upgradeHas < gear.upgradeMax) && gear.equipped.itemLevel < maxUpgrade
                }
            }
        }

        gear.highlight = gear.missingEnchant || gear.missingGem || gear.missingHeirloom || gear.missingUpgrade
    }

    return ret
}
