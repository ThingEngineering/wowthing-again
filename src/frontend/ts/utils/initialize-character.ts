import keys from 'lodash/keys'

import {InventorySlot, slotOrder} from '../data/inventory-slot'
import type {Character} from '../types'

export default function initializeCharacter(character: Character) {
    if (keys(character.equippedItems).length > 0) {
        let count = 0, itemLevels = 0
        for (let j = 0; j < slotOrder.length; j++) {
            const slot = slotOrder[j]
            const item = character.equippedItems[slot]
            if (item !== undefined) {
                itemLevels += item.itemLevel
                count++
                if (slot === InventorySlot.MainHand && character.equippedItems[InventorySlot.OffHand] === undefined) {
                    itemLevels += item.itemLevel
                    count++
                }
            }
        }

        const itemLevel = itemLevels / count
        if ((itemLevel - character.equippedItemLevel) < 1) {
            character.calculatedItemLevel = itemLevel.toFixed(1)
        }
    }

    if (character.calculatedItemLevel === undefined) {
        character.calculatedItemLevel = character.equippedItemLevel.toFixed(1)
    }

    // 226 = mythic  5
    // 213 = heroic  4
    // 200 = normal  3
    // 187 = lfr     2
    // 174 = ?       1
    // 161 = ?       0
    character.calculatedItemLevelQuality = Math.floor(Math.max(0, Math.min(6, (parseFloat(character.calculatedItemLevel) - 148) / 13)))
}
