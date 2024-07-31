import { getBaseScoreForKeyLevel } from './get-base-score-for-key-level';
import { getWeeklyAffixes } from './get-weekly-affixes';
import type { Character, CharacterMythicPlusAddonMapAffix } from '@/types';

type IsKeystoneUpgradeResult = {
    isUpgrade: boolean;
    mapInfo: CharacterMythicPlusAddonMapAffix;
    mapInfoAlt: CharacterMythicPlusAddonMapAffix;
    maxScoreIncrease: number;
    minScoreIncrease: number;
};

export function isKeystoneUpgrade(
    character: Character,
    season: number,
    dungeonId: number,
): IsKeystoneUpgradeResult {
    const addonMap = character.mythicPlusSeasons?.[season]?.[dungeonId];
    const affixes = getWeeklyAffixes(character);

    const ret: IsKeystoneUpgradeResult = {
        isUpgrade: false,
        mapInfo: null,
        mapInfoAlt: null,
        maxScoreIncrease: 0,
        minScoreIncrease: 0,
    };

    if (addonMap && affixes) {
        if (affixes[0].slug === 'fortified') {
            ret.mapInfo = addonMap.fortifiedScore;
            ret.mapInfoAlt = addonMap.tyrannicalScore;
        } else {
            ret.mapInfo = addonMap.tyrannicalScore;
            ret.mapInfoAlt = addonMap.fortifiedScore;
        }

        const scoreValues = [ret.mapInfo?.score ?? 0, ret.mapInfoAlt?.score ?? 0];
        const score = Math.max(...scoreValues) + scoreValues.reduce((a, b) => a + b, 0) / 2;

        const baseScore = getBaseScoreForKeyLevel(character.weekly.keystoneLevel);
        ret.minScoreIncrease = Math.max(
            0,
            getExpectedScore(baseScore - 5 - 5, scoreValues[1]) - score,
        );
        ret.maxScoreIncrease = Math.max(0, getExpectedScore(baseScore + 5, scoreValues[1]) - score);

        ret.isUpgrade = !ret.mapInfo || ret.maxScoreIncrease > 0;
    }

    return ret;
}

function getExpectedScore(score1: number, score2: number): number {
    return Math.max(score1, score2) + (score1 + score2) / 2;
}
