import { get } from 'svelte/store'

import { professionIdToString } from '@/data/professions'
import { ProfessionSubclass } from '@/enums/profession-subclass'
import { itemStore } from '@/stores'
import type { Character, CharacterEquippedItem } from '@/types'


export function getProfessionEquipment(
    character: Character,
    professionId: number
): Record<number, CharacterEquippedItem> {
    const itemData = get(itemStore)
    const professionSlug = professionIdToString[professionId]

    const equippedItems: Record<number, CharacterEquippedItem> = {}
    if (professionId === 185) { // Cooking
        for (let slot = 26; slot <= 27; slot++) {
            equippedItems[slot - 26] = character.equippedItems[slot]
        }
    }
    else if (professionId === 356) { // Fishing
        for (let slot = 28; slot <= 30; slot++) {
            equippedItems[slot - 28] = character.equippedItems[slot]
        }
    }
    else {
        for (let slot = 20; slot <= 25; slot++) {
            const equippedItem = character.equippedItems[slot]
            if (equippedItem) {
                const item = itemData.items[equippedItem.itemId]
                if (ProfessionSubclass[item.subclassId].toLowerCase() === professionSlug) {
                    equippedItems[(slot - 20) % 3] = equippedItem
                }
            }
        }
    }

    return equippedItems
}
