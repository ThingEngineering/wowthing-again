import { convertibleCategories } from '@/components/items/convertible/data';

export const itemLevelQuality: number[][] = [
    [convertibleCategories[0].tiers[0].itemLevel + 13, 6], // MID S1 is wack
    [convertibleCategories[0].tiers[0].itemLevel, 5], // Mythic raid equivalent
    [convertibleCategories[0].tiers[1].itemLevel, 4], // Heroic raid equivalent
    [convertibleCategories[0].tiers[2].itemLevel, 3], // Normal raid equivalent
    [convertibleCategories[0].tiers[3].itemLevel, 2], // LFR raid equivalent
    [convertibleCategories[0].tiers[3].itemLevel - 13, 1],
];
