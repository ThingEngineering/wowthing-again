import { get } from 'svelte/store'

import { InventoryType } from '@/enums/inventory-type'
import { staticStore } from '@/stores/static'
import type { TierData } from '@/data/gear'
import type { Character } from '@/types'


type TierPieces = [string, number, number][]

export function getTierPieces(
    tierData: TierData,
    tierMap: Record<number, InventoryType>,
    character: Character
): TierPieces {
    if (character.equippedItems) {
        const staticData = get(staticStore)

        const tierPieceMap: Record<string, [number, number]> = {}
        for (const tierSlot in tierData.slots) {
            tierPieceMap[tierSlot] = [0, 0]
        }

        for (const item of Object.values(character.equippedItems)) {
            const tierSlot = tierMap[item.itemId]
            if (tierSlot) {
                tierPieceMap[tierSlot === InventoryType.Chest2 ? InventoryType.Chest : tierSlot] = [
                    item.itemId,
                    item.itemLevel,
                ]
            }
        }

        return tierData.slots
            .filter(slot => slot !== InventoryType.Chest2)
            .map((slot) => [
                staticData.inventoryTypes[slot],
                ...(tierPieceMap[slot] || [0, 0]),
            ])
    }
}
