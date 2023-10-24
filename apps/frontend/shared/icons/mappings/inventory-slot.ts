import type { IconifyIcon } from '@iconify/types'

import * as iconLibrary from '../library'
import { InventorySlot } from '@/enums/inventory-slot'


export const inventorySlotIcons: Record<number, IconifyIcon> = {
    [InventorySlot.Head]: iconLibrary.gameBarbute,
    [InventorySlot.Shoulders]: iconLibrary.gameDorsalScales,
    [InventorySlot.Back]: iconLibrary.gameCape,
    [InventorySlot.Chest]: iconLibrary.gameChestArmor,
    [InventorySlot.Wrist]: iconLibrary.gameBracer,
    [InventorySlot.Waist]: iconLibrary.gameBeltArmor,
    [InventorySlot.Hands]: iconLibrary.gameGauntlet,
    [InventorySlot.Legs]: iconLibrary.gameGreaves,
    [InventorySlot.Feet]: iconLibrary.gameMetalBoot,
}
