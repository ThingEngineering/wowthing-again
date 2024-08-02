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
    ].map((n) => [n, true]),
);

export const validEnchants: Record<number, number[]> = {
    [InventorySlot.MainHand]: [
        3368, // Rune of the Fallen Crusader [DK]
        6243, // Rune of Hysteria [DK]
        6527, // High Intensity Thermal Scanner 2 [Ranged]
        6528, // High Intensity Thermal Scanner 3 [Ranged]
        // 6641, // Sophic Devotion 1
        6642, // Sophic Devotion 2
        6643, // Sophic Devotion 3
        // 6647, // Frozen Devotion 1
        6648, // Frozen Devotion 2
        6649, // Frozen Devotion 3
        6826, // Shadowflame Wreathe 2
        6827, // Shadowflame Wreathe 3
    ],

    [InventorySlot.Back]: [
        6592, // Graceful Avoidance 3
        6598, // Regenerative Leech 3
    ],

    [InventorySlot.Chest]: [
        6621, // Sustained Strength 2
        6622, // Sustained Strength 3
        6625, // Waking Stats 3
    ],

    [InventorySlot.Wrist]: [
        6573, // Devotion of Avoidance 2
        6574, // Devotion of Avoidance 3
        6579, // Devotion of Leech 2
        6580, // Devotion of Leech 3
    ],

    [InventorySlot.Legs]: [
        6489, // Fierce Armor Kit 2
        6490, // Fierce Armor Kit 3
        6540, // Frozen Spellthread 2
        6541, // Frozen Spellthread 3
        6829, // Lambent Armor Kit 2
        6830, // Lambent Armor Kit 3
    ],

    [InventorySlot.Feet]: [
        6606, // Plainsrunner's Breeze 2
        6607, // Plainsrunner's Breeze 3
        6612, // Watcher's Loam 2
        6613, // Watcher's Loam 3
    ],

    [InventorySlot.Ring1]: [
        6550, // Critical Strike 3
        6556, // Haste 3
        6562, // Mastery 3
        6568, // Versatility 3
    ],
};

export const specialValidEnchants: Record<number, SpecialValidEnchant> = {
    // FIXME
    /*[InventorySlot.Hands]: {
        enchants: [
            6210, // Eternal Strength
        ],
        checkFunc: (character: Character) =>
            specializationMap[character.activeSpecId]?.mainStat === PrimaryStat.Strength
    },

    [InventorySlot.Wrist]: {
        enchants: [
            6220, // Eternal Intellect
        ],
        checkFunc: (character: Character) =>
            specializationMap[character.activeSpecId]?.mainStat === PrimaryStat.Intellect
    },

    [InventorySlot.Feet]: {
        enchants: [
            6211, // Eternal Agility
        ],
        checkFunc: (character: Character) =>
            specializationMap[character.activeSpecId]?.mainStat === PrimaryStat.Agility
    },*/
};

interface SpecialValidEnchant {
    enchants: number[];
    checkFunc: (character: Character) => boolean;
}

export const gemBonusIds: number[] = [
    6935, // SL legendary socket?
    7576, // ??
    7580, // SL Season 3?
    7935, // DF ??
    8780, // DF +1 item
    8781, // DF +2 item
    8782, // DF +3 item
];

export const characterBagSlots: number[] = [
    1,
    2,
    3,
    4,
    5, // Reagent bag
];

export const bankBagSlots: number[] = [6, 7, 8, 9, 10, 11, 12];
