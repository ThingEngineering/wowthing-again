import type { Character, CharacterMythicPlusAddonMapAffix, CharacterMythicPlusRun } from '@/types';
import getFirstMatch from '../get-first-match';

const qualityBreakpoints: number[][] = [
    [26, 6],
    [21, 5],
    [16, 4],
    [11, 3],
    [6, 2],
    [1, 1],
];

const remixBreakpoints: number[][] = [
    [51, 6],
    [41, 5],
    [31, 4],
    [21, 3],
    [11, 2],
    [1, 1],
];

export function getRunQuality(run: CharacterMythicPlusRun | number, character?: Character): string {
    let level = 0;
    if (typeof run !== 'number') {
        if (!run.timed) {
            return 'quality0';
        }
        level = run.keystoneLevel;
    } else {
        level = run;
    }

    return `quality${getFirstMatch(character?.isRemix ? remixBreakpoints : qualityBreakpoints, level)}`;
}

export function getRunQualityAffix(run: CharacterMythicPlusAddonMapAffix): string {
    return run.overTime ? 'quality0' : getQuality(run.level);
}

function getQuality(level: number, character?: Character): string {
    if (level >= 26) {
        return 'quality6';
    } else if (level >= 21) {
        return 'quality5';
    } else if (level >= 16) {
        return 'quality4';
    } else if (level >= 11) {
        return 'quality3';
    } else if (level >= 6) {
        return 'quality2';
    } else {
        return 'quality1';
    }
}
