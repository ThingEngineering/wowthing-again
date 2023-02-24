import { get } from 'svelte/store'

import { currentTier } from '@/data/gear'
import { InventoryType } from '@/enums'
import { itemStore } from '@/stores'
import type { Character } from '@/types'


type TierPieces = [string, number, number][]

export function getTierPieces(character: Character): TierPieces {
    if (character.equippedItems) {
        const itemData = get(itemStore)

        const tierPieceMap: Record<string, [number, number]> = {}
        for (const tierSlot in currentTier.slots) {
            tierPieceMap[tierSlot] = [0, 0]
        }

        for (const item of Object.values(character.equippedItems)) {
            const tierSlot = itemData.currentTier[item.itemId]
            if (tierSlot) {
                tierPieceMap[tierSlot === InventoryType.Chest2 ? InventoryType.Chest : tierSlot] = [
                    item.itemId,
                    item.itemLevel,
                ]
            }
        }

        return currentTier.slots
            .filter(slot => slot !== InventoryType.Chest2)
            .map((slot) => [
                InventoryType[slot],
                ...(tierPieceMap[slot] || [0, 0]),
            ])
    }
}
