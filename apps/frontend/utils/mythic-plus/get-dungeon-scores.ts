import type { CharacterMythicPlusAddonMap } from '@/types';

export function getDungeonScores(addonMap: CharacterMythicPlusAddonMap): DungeonScores {
    const scores: DungeonScores = {
        fortifiedInitial: addonMap?.fortifiedScore?.score ?? 0,
        fortifiedFinal: 0,
        tyrannicalInitial: addonMap?.tyrannicalScore?.score ?? 0,
        tyrannicalFinal: 0,
    };

    if (scores.fortifiedInitial >= scores.tyrannicalInitial) {
        scores.fortifiedFinal = scores.fortifiedInitial * 1.5;
        scores.tyrannicalFinal = scores.tyrannicalInitial / 2;
    } else {
        scores.fortifiedFinal = scores.fortifiedInitial / 2;
        scores.tyrannicalFinal = scores.tyrannicalInitial * 1.5;
    }

    return scores;
}

export interface DungeonScores {
    fortifiedInitial: number;
    fortifiedFinal: number;
    tyrannicalInitial: number;
    tyrannicalFinal: number;
}
