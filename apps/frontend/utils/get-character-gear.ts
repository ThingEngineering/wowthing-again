import some from 'lodash/some'

import { Constants } from '@/data/constants'
import { ratingItemLevelUpgrade } from '@/data/dungeon'
import { gemBonusIds, heirloomSlots, slotOrder, specialValidEnchants, validEnchants } from '@/data/inventory-slot'
import getFirstMatch from '@/utils/get-first-match'
import type { GearState } from '@/stores/local-storage'
import type { Character, CharacterGear } from '@/types'


export default function getCharacterGear(
    state: GearState,
    character: Character
): CharacterGear[] {
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

        if (state.highlightHeirlooms && character.level < Constants.characterMaxLevel) {
            if (heirloomSlots[inventorySlot] && gear.equipped.quality !== 7) {
                gear.missingHeirloom = true
            }
        }

        if (character.level === Constants.characterMaxLevel && gear.equipped.itemLevel >= 200) {
            if (state.highlightEnchants) {
                const enchants = validEnchants[inventorySlot]
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
                if (some(gear.equipped.bonusIds, (b) => gemBonusIds.indexOf(b) >= 0)) {
                    gear.missingGem = gear.equipped.gemIds.length === 0
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
                if (some(gear.equipped.bonusIds, (b) => b >= 8189 && b <= 8286)) {
                    gear.upgradeHas = Math.round((gear.equipped.itemLevel - 259) / 3.33)
                    gear.upgradeMax = 12

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
