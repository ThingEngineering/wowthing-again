import keys from 'lodash/keys'

import {InventorySlot, slotOrder} from '../data/inventory-slot'
import type {UserData} from '../types'

export default function initializeUser(userData: UserData) {
    console.time('initializeUser')
    for (let i = 0; i < userData.characters.length; i++) {
        const character = userData.characters[i]
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
    }
    console.timeEnd('initializeUser')
}
