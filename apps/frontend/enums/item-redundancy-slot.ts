import { InventoryType } from './inventory-type';

export enum ItemRedundancySlot {
    Head = 0,
    Neck = 1,
    Shoulder = 2,
    Chest = 3,
    Waist = 4,
    Legs = 5,
    Feet = 6,
    Wrist = 7,
    Hand = 8,
    Finger = 9,
    Trinket = 10,
    Cloak = 11,
    Twohand = 12,
    MainhandWeapon = 13,
    OnehandWeapon = 14,
    OnehandWeaponSecond = 15,
    Offhand = 16,
}

export const inventoryTypeToItemRedundancySlot: Record<number, number> = {
    [InventoryType.Head]: ItemRedundancySlot.Head,
    [InventoryType.Shoulders]: ItemRedundancySlot.Shoulder,
    [InventoryType.Chest]: ItemRedundancySlot.Chest,
    [InventoryType.Waist]: ItemRedundancySlot.Waist,
    [InventoryType.Legs]: ItemRedundancySlot.Legs,
    [InventoryType.Feet]: ItemRedundancySlot.Feet,
    [InventoryType.Wrist]: ItemRedundancySlot.Wrist,
    [InventoryType.Hands]: ItemRedundancySlot.Hand,
    [InventoryType.Back]: ItemRedundancySlot.Cloak,
};
