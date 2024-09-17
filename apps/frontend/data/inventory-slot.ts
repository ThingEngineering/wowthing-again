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

// SpellItemEnchantment.db2
export const validEnchants: Record<number, number[]> = {
    [InventorySlot.MainHand]: [
        3368, // Rune of the Fallen Crusader [DK]
        5870, // Rune of the Fallen Crusader [DK]
        // 6243, // Rune of Hysteria [DK]
        3370, // Rune of Razorice [DK]
        5869, // Rune of Razorice [DK]
        3847, // Rune of the Stoneskin Gargoyle [DK]
        7449, // Authority of Air
        7450, // Authority of Air
        7451, // Authority of Air
        7452, // Authority of Fiery Resolve
        7453, // Authority of Fiery Resolve
        7454, // Authority of Fiery Resolve
        7461, // Authority of Radiant Power
        7462, // Authority of Radiant Power
        7463, // Authority of Radiant Power
        7455, // Authority of Storms
        7456, // Authority of Storms
        7457, // Authority of Storms
        7458, // Authority of the Depths 1
        7459, // Authority of the Depths 2
        7460, // Authority of the Depths 3
        7437, // Council's Guile
        7438, // Council's Guile
        7439, // Council's Guile
        7446, // Oathsworn's Tenacity
        7447, // Oathsworn's Tenacity
        7448, // Oathsworn's Tenacity
        7443, // Stonebound Artistry
        7444, // Stonebound Artistry
        7445, // Stonebound Artistry
        7440, // Stormrider's Fury
        7441, // Stormrider's Fury
        7442, // Stormrider's Fury
    ],

    [InventorySlot.Back]: [
        7413, // Chant of Burrowing Rapidity 1 [1651]
        7414, // Chant of Burrowing Rapidity 2
        7415, // Chant of Burrowing Rapidity 3
        7407, // Chant of Leeching Fangs 1 [1653]
        7408, // Chant of Leeching Fangs 2
        7409, // Chant of Leeching Fangs 3
        7401, // Chant of Winged Grace 1 [1655]
        7402, // Chant of Winged Grace 2
        7403, // Chant of Winged Grace 3
        7400, // Whisper of Silken Avoidance 3 [1656]
        7406, // Whisper of Silken Leech 3 [1654]
        7412, // Whisper of Silken Speed 3 [1652]
    ],

    [InventorySlot.Chest]: [
        6625, // Waking Stats 3 (TODO: remove if the TWW enchants ever become affordable)
        7356, // Council's Intellect 1 [1628]
        7357, // Council's Intellect 2
        7358, // Council's Intellect 3
        7362, // Crystalline Radiance 1 [1629]
        7363, // Crystalline Radiance 2
        7364, // Crystalline Radiance 3
        7359, // Oathsworn's Strength 1 [1630]
        7360, // Oathsworn's Strength 2
        7361, // Oathsworn's Strength 3
        7353, // Stormrider's Agility 1 [1627]
        7354, // Stormrider's Agility 2
        7355, // Stormrider's Agility 3
    ],

    [InventorySlot.Wrist]: [
        7383, // Chant of Armored Avoidance 1 [1646]
        7384, // Chant of Armored Avoidance 2
        7385, // Chant of Armored Avoidance 3
        7389, // Chant of Armored Leech 1 [1648]
        7390, // Chant of Armored Leech 2
        7391, // Chant of Armored Leech 3
        7395, // Chant of Armored Speed 1 [1650]
        7396, // Chant of Armored Speed 2
        7397, // Chant of Armored Speed 3
        7382, // Whisper of Armored Avoidance 3 [1645]
        7388, // Whisper of Armored Leech 3 [1647]
        7394, // Whisper of Armored Speed 3 [1649]
    ],

    [InventorySlot.Legs]: [
        7529, // Daybreak Spellthread 1
        7530, // Daybreak Spellthread 2
        7531, // Daybreak Spellthread 3
        7532, // Sunset Spellthread 1
        7533, // Sunset Spellthread 2
        7534, // Sunset Spellthread 3
        7535, // Weavercloth Spellthread 1
        7536, // Weavercloth Spellthread 2
        7537, // Weavercloth Spellthread 3
        7593, // Defender's Armor Kit 1
        7594, // Defender's Armor Kit 2
        7595, // Defender's Armor Kit 3
        // 7596, // Dual Layered Armor Kit 1
        7597, // Dual Layered Armor Kit 2
        7598, // Dual Layered Armor Kit 3
        // 7599, // Stormbound Armor Kit 1
        7602, // Stormbound Armor Kit 2
        7601, // Stormbound Armor Kit 3
    ],

    [InventorySlot.Feet]: [
        7422, // Defender's March 1 [1578]
        7423, // Defender's March 2
        7424, // Defender's March 3
    ],

    [InventorySlot.Ring1]: [
        7468, // Cursed Critical Strike 1 [1657]
        7469, // Cursed Critical Strike 2
        7470, // Cursed Critical Strike 3
        7471, // Cursed Haste 1 [1658]
        7472, // Cursed Haste 2
        7473, // Cursed Haste 3
        7477, // Cursed Mastery 1 [1659]
        7478, // Cursed Mastery 2
        7479, // Cursed Mastery 3
        7474, // Cursed Versatility 1 [1660]
        7475, // Cursed Versatility 2
        7476, // Cursed Versatility 3
        7331, // Glimmering Critical Strike 3 [1579]
        7337, // Glimmering Haste 3 [1581]
        7343, // Glimmering Mastery 3 [1583]
        7349, // Glimmering Versatility 3 [1585]
        7332, // Radiant Critical Strike 1 [1580]
        7333, // Radiant Critical Strike 2
        7334, // Radiant Critical Strike 3
        7338, // Radiant Haste 1 [1582]
        7339, // Radiant Haste 2
        7340, // Radiant Haste 3
        7344, // Radiant Mastery 1 [1584]
        7345, // Radiant Mastery 2
        7346, // Radiant Mastery 3
        7350, // Radiant Versatility 1 [1586]
        7351, // Radiant Versatility 2
        7352, // Radiant Versatility 3
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
