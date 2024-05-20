import { get } from 'svelte/store';

import { typeOrder } from '@/data/inventory-type';
import { InventoryType } from '@/enums/inventory-type';
import { staticStore } from '@/shared/stores/static';
import { itemStore } from '@/stores';
import type { LazyConvertibleCharacterItem } from '@/stores/lazy/convertible';
import type { Character } from '@/types';

type TierPieces = [string, number, number, LazyConvertibleCharacterItem?][];

export function getTierPieces(
    itemSetIds: number[],
    tierMap: Record<number, InventoryType>,
    character: Character,
): TierPieces {
    if (character.equippedItems) {
        const itemData = get(itemStore);
        const staticData = get(staticStore);

        const tierPieceMap: Record<string, [number, number]> = {};
        for (const itemSetId of itemSetIds) {
            const itemSet = itemData.itemSets[itemSetId];
            for (const itemId of itemSet.itemIds) {
                const item = itemData.items[itemId];
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
            .map((type) => [staticData.inventoryTypes[type], ...tierPieceMap[type]]);
    }
}
