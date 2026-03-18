import * as iconLibrary from '../library';
import { InventorySlot } from '@/enums/inventory-slot';
import type { Icon } from '@/types/icons';

export const inventorySlotIcons: Record<number, Icon> = {
    [InventorySlot.Head]: iconLibrary.gameBarbute,
    [InventorySlot.Shoulders]: iconLibrary.gameDorsalScales,
    [InventorySlot.Back]: iconLibrary.gameCape,
    [InventorySlot.Chest]: iconLibrary.gameChestArmor,
    [InventorySlot.Wrist]: iconLibrary.gameBracer,
    [InventorySlot.Waist]: iconLibrary.gameBeltArmor,
    [InventorySlot.Hands]: iconLibrary.gameGauntlet,
    [InventorySlot.Legs]: iconLibrary.gameGreaves,
    [InventorySlot.Feet]: iconLibrary.gameMetalBoot,
};
