import { convertibleCategories } from '@/components/items/convertible/data';

export const itemLevelQuality: number[][] = [
    [convertibleCategories[0].tiers[0].itemLevel, 5], // Mythic raid = 662-671, +10 vault = 662
    [convertibleCategories[0].tiers[1].itemLevel, 4], // Heroic raid = 649-658, + 2 vault = 649
    [convertibleCategories[0].tiers[2].itemLevel, 3], // Normal raid = 636-645
    [convertibleCategories[0].tiers[3].itemLevel, 2], // LFR raid    = 623-632,   H vault = 632
    [convertibleCategories[0].tiers[3].itemLevel - 13, 1], //
];
