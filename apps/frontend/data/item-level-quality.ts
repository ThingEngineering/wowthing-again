import { ItemLevels } from './constants';

export const itemLevelQuality: number[][] = [
    [ItemLevels.Myth[5], 6], // Lots of gear
    [ItemLevels.Myth[1], 5], // Mythic raid equivalent
    [ItemLevels.Hero[1], 4], // Heroic raid equivalent
    [ItemLevels.Champion[1], 3], // Normal raid equivalent
    [ItemLevels.Veteran[1], 2], // LFR raid equivalent
    [ItemLevels.Adventurer[1], 1],
];
