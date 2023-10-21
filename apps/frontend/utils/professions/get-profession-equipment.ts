import { get } from 'svelte/store'

import { professionIdToString } from '@/data/professions'
import { ProfessionSubclass } from '@/enums/profession-subclass'
import { itemStore } from '@/stores'
import type { Character, CharacterEquippedItem } from '@/types'


const limitCategoryToSlot: Record<number, number> = {
    506: 1, // Alchemy head
    510: 2, // Alchemy chest
    517: 1, // Blacksmithing toolkit
    514: 2, // Blacksmithing chest
    507: 1, // Enchanting focus
    525: 2, // Enchanting head
    530: 1, // Engineering head
    529: 2, // Engineering gloves
    536: 1, // Herbalism basket
    539: 2, // Herbalism head
    509: 1, // Inscription magnifying glass
    543: 2, // Inscription glasses
    548: 1, // Jewelcrafting loupe
    546: 2, // Jewelcrafting chest
    554: 1, // Leatherworking toolset
    551: 2, // Leatherworking chest
    555: 1, // Mining satchel
    558: 2, // Mining head
    559: 1, // Skinning pack
    562: 2, // Skinning
    567: 1, // Tailoring needles
    564: 2, // Tailoring chest
}

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
                    if (item.limitCategory && limitCategoryToSlot[item.limitCategory]) {
                        equippedItems[limitCategoryToSlot[item.limitCategory]] = equippedItem
                    }
                    else {
                        equippedItems[(slot - 20) % 3] = equippedItem
                    }
                }
            }
        }
    }

    return equippedItems
}
