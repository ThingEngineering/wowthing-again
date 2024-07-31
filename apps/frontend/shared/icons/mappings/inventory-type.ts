import type { IconifyIcon } from '@iconify/types'

import * as iconLibrary from '../library'
import { InventoryType } from '@/enums/inventory-type'


export const inventoryTypeIcons: Record<InventoryType, IconifyIcon> = {
    [InventoryType.NonEquippable]: null,
    [InventoryType.Head]: iconLibrary.gameBarbute,
    [InventoryType.Neck]: iconLibrary.gameHeartNecklace,
    [InventoryType.Shoulders]: iconLibrary.gameDorsalScales,
    [InventoryType.Shirt]: iconLibrary.gameShirt,
    [InventoryType.Chest]: iconLibrary.gameChestArmor,
    [InventoryType.Waist]: iconLibrary.gameBeltArmor,
    [InventoryType.Legs]: iconLibrary.gameGreaves,
    [InventoryType.Feet]: iconLibrary.gameMetalBoot,
    [InventoryType.Wrist]: iconLibrary.gameBracer,
    [InventoryType.Hands]: iconLibrary.gameGauntlet,
    [InventoryType.Finger]: iconLibrary.gameBigDiamondRing,
    [InventoryType.Trinket]: null,
    [InventoryType.OneHand]: null,
    [InventoryType.OffHand]: null,
    [InventoryType.Ranged]: null,
    [InventoryType.Back]: iconLibrary.gameCape,
    [InventoryType.TwoHand]: null,
    [InventoryType.Bag]: iconLibrary.gameBackpack,
    [InventoryType.Tabard]: null,
    [InventoryType.Chest2]: null,
    [InventoryType.MainHand]: null,
    [InventoryType.OffHand2]: null,
    [InventoryType.HeldInOffHand]: null,
    [InventoryType.Ammo]: null,
    [InventoryType.Thrown]: null,
    [InventoryType.Ranged2]: null,
    [InventoryType.Quiver]: null,
    [InventoryType.Relic]: null,
    [InventoryType.ProfessionTool]: null,
    [InventoryType.ProfessionGear]: null
}
