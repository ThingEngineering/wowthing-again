import { DateTime } from 'luxon';

import { Constants } from '@/data/constants';
import { experiencePerLevel } from '@/data/experience';
import type { Character } from '@/types';
import { toNiceDuration } from '@/utils/formatting';

export function getCharacterRested(now: DateTime, character: Character): [string, string?] {
    if (character.level === Constants.characterMaxLevel) {
        return [''];
    }

    // Pandas rest twice as fast and go up to 300%??
    const isPandaren =
        character.raceId === 24 || character.raceId === 25 || character.raceId === 26;
    const maxPercent = isPandaren ? 300 : 150;
    const earnRate = character.isResting ? 1 : 0.25;

    let restedPercent = Math.min(
        maxPercent,
        Math.round((character.restedExperience / experiencePerLevel[character.level]) * 100),
    );

    // Calculate earned since last seen
    if (restedPercent < maxPercent) {
        const restedEarned =
            (now.diff(character.lastSeenAddon).toMillis() / 1000 / Constants.restedDuration) *
            maxPercent *
            earnRate;
        restedPercent = Math.min(maxPercent, restedPercent + restedEarned);
    }

    // Calculate time until maxed
    let timeUntilMaxed: string;
    if (restedPercent < maxPercent) {
        const remaining =
            (Constants.restedDuration * (1 - restedPercent / maxPercent)) / Math.min(1, earnRate);
        timeUntilMaxed = toNiceDuration(remaining * 1000);
    }

    return [
        `${Math.floor(restedPercent)} %`,
        timeUntilMaxed ? `<code>${timeUntilMaxed}</code> to max` : '',
    ];
}
