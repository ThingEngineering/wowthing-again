import { ItemLevels } from './constants';
import { Difficulty } from '@/enums/difficulty';

// [key level, item level] first match >= key is used
export const dungeonVaultItemLevel: Array<Array<number>> = [
    [10, ItemLevels.Myth[1], 5], // Mythic+ 10+
    [7, ItemLevels.Hero[4], 4], // Mythic+ 7-9
    [6, ItemLevels.Hero[3], 4], // Mythic+ 6
    [4, ItemLevels.Hero[2], 4], // Mythic+ 4-5
    [2, ItemLevels.Hero[1], 4], // Mythic+ 2-3
    [1, ItemLevels.Champion[4], 3], // Mythic
    [0, ItemLevels.Veteran[4], 2], // Heroic
];

export const raidVaultItemLevel: Record<number, Array<number>> = {
    [Difficulty.RaidMythic]: [ItemLevels.Myth[6], 5],
    [Difficulty.RaidHeroic]: [ItemLevels.Myth[1], 5],
    [Difficulty.RaidNormal]: [ItemLevels.Hero[1], 4],
    [Difficulty.RaidLookingForRaid]: [ItemLevels.Champion[1], 3],
};

export const worldVaultItemLevel: Array<Array<number>> = [
    [8, ItemLevels.Hero[1], 4],
    [7, ItemLevels.Champion[3], 3],
    [6, ItemLevels.Champion[2], 3],
    [5, ItemLevels.Champion[1], 3],
    [4, ItemLevels.Veteran[4], 2],
    [3, ItemLevels.Veteran[3], 2],
    [2, ItemLevels.Veteran[2], 2],
    [1, ItemLevels.Veteran[1], 2],
];
