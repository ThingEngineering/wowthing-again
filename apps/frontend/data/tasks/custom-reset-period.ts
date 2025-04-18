import { get } from 'svelte/store';

import { timeStore } from '@/shared/stores/time';
import { userStore } from '@/stores';
import type { Character } from '@/types';
import type { DateTime } from 'luxon';

export function customResetPeriod(
    char: Character,
    scannedAt: DateTime,
    startPeriod: number,
    weeks: number,
): DateTime {
    const now = get(timeStore);
    const currentPeriod = userStore.getCurrentPeriodForCharacter(now, char);
    const scannedPeriod = userStore.getPeriodForCharacter2(scannedAt, char);

    const targetPeriod = scannedPeriod.id >= startPeriod ? scannedPeriod : currentPeriod;
    let resetPeriod = startPeriod;
    while (resetPeriod < targetPeriod.id) {
        resetPeriod += weeks;
    }

    // skip ahead if it's the same as the scanned period
    if (resetPeriod === scannedPeriod.id) {
        resetPeriod += weeks;
    }

    const foo = userStore.getPeriodForCharacter(now, char, resetPeriod);
    return foo.startTime;
}
