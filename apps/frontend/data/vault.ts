import { convertibleCategories } from '@/components/items/convertible/data';

// [key level, item level] first match >= key is used
export const keyVaultItemLevel: Array<Array<number>> = [
    [10, 318, 5], // Myth 1
    [7, 315, 4], // Hero 4
    [6, 311, 4], // Hero 3
    [4, 308, 4], // Hero 2
    [2, 305, 4], // Hero 1
    [1, 302, 3], // [0] Champion 4
    [0, 289, 2], // [H] Veteran 4
];

export const raidVaultItemLevel: Record<number, Array<number>> = {
    16: [convertibleCategories[0].tiers[0].itemLevel, 5], // Mythic
    15: [convertibleCategories[0].tiers[1].itemLevel, 4], // Heroic
    14: [convertibleCategories[0].tiers[2].itemLevel, 3], // Normal
    17: [convertibleCategories[0].tiers[3].itemLevel, 2], // LFR
};

export const worldVaultItemLevel: Array<Array<number>> = [
    // [13, 315, 4], // Hero 4 (ritual 5?)
    // [12, 308, 4], // Hero 2 (ritual 4?)
    // [8, 298, 4], // Hero 1
    [7, 298, 3], // Champion 3
    [6, 295, 3], // Champion 2
    [5, 292, 3], // Champion 1
    [4, 289, 2], // Veteran 4
    [3, 285, 2], // Veteran 3
    [2, 282, 2], // Veteran 2
    [1, 279, 2], // Veteran 1
];
