import { typeOrder } from '@/data/inventory-type';
import { InventoryType } from '@/enums/inventory-type';
import { wowthingData } from '@/shared/stores/data';
import type { LazyConvertibleCharacterItem } from '@/user-home/state/lazy/convertible.svelte';
import type { Character } from '@/types';

type TierPieces = [string, number, number, LazyConvertibleCharacterItem?][];

export function getTierPieces(
    itemSetIds: number[],
    tierMap: Record<number, InventoryType>,
    character: Character
): TierPieces {
    if (character.equippedItems) {
        const tierPieceMap: Record<string, [number, number]> = {};
        for (const itemSetId of itemSetIds) {
            const itemSet = wowthingData.items.itemSets[itemSetId];
            for (const itemId of itemSet.itemIds) {
                const item = wowthingData.items.items[itemId];
                const inventoryType =
                    item.inventoryType === InventoryType.Chest2
                        ? InventoryType.Chest
                        : item.inventoryType;
                tierPieceMap[inventoryType] = [0, 0];
            }
        }

        for (const item of Object.values(character.equippedItems)) {
            const tierSlot = tierMap[item.itemId];
            if (tierSlot) {
                tierPieceMap[tierSlot === InventoryType.Chest2 ? InventoryType.Chest : tierSlot] = [
                    item.itemId,
                    item.itemLevel,
                ];
            }
        }

        return typeOrder
            .filter((type) => tierPieceMap[type] !== undefined)
            .map((type) => [
                wowthingData.static.inventoryTypeById.get(type),
                ...tierPieceMap[type],
            ]);
    }
}
