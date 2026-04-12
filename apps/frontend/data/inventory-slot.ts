import { InventorySlot } from '@/enums/inventory-slot';
import type { Character } from '@/types';

export const slotOrder: InventorySlot[] = [
    InventorySlot.MainHand,
    InventorySlot.OffHand,
    InventorySlot.Head,
    InventorySlot.Neck,
    InventorySlot.Shoulders,
    InventorySlot.Back,
    InventorySlot.Chest,
    InventorySlot.Wrist,
    InventorySlot.Hands,
    InventorySlot.Waist,
    InventorySlot.Legs,
    InventorySlot.Feet,
    InventorySlot.Ring1,
    InventorySlot.Ring2,
    InventorySlot.Trinket1,
    InventorySlot.Trinket2,
];

export const slotOrderMap = Object.fromEntries(slotOrder.map((slot, index) => [slot, index]));

export const heirloomSlots: Record<number, boolean> = Object.fromEntries(
    [
        [InventorySlot.Head],
        [InventorySlot.Neck],
        [InventorySlot.Shoulders],
        [InventorySlot.Back],
        [InventorySlot.Chest],
        [InventorySlot.Legs],
        [InventorySlot.Ring1],
        [InventorySlot.Ring2],
        [InventorySlot.Trinket1],
        [InventorySlot.Trinket2],
        [InventorySlot.MainHand],
        [InventorySlot.OffHand],
    ].map((n) => [n, true])
);

export const characterBagSlots: number[] = [
    1,
    2,
    3,
    4,
    5, // Reagent bag
];

export const bankBagSlots: number[] = [6, 7, 8, 9, 10, 11, 12];
