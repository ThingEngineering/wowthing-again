import some from 'lodash/some'

import type {Character, CharacterGear} from '@/types'
import {Constants} from '@/data/constants'
import {gemBonusIds, slotOrder, specialValidEnchants, validEnchants} from '@/data/inventory-slot'

export default function getCharacterGear(character: Character): CharacterGear[] {
    const ret: CharacterGear[] = []

    for (const inventorySlot of slotOrder) {
        const gear: CharacterGear = {
            equipped: character.equippedItems[inventorySlot],
            missingEnchant: false,
            missingGem: false,
            upgradeable: false,
        }
        ret.push(gear)

        if (!gear.equipped || character.level < Constants.characterMaxLevel || gear.equipped.itemLevel < 200) {
            continue
        }

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

        if (some(gear.equipped.bonusIds, (b) => gemBonusIds.indexOf(b) >= 0)) {
            gear.missingGem = gear.equipped.gemIds.length === 0
        }
    }

    return ret
}
