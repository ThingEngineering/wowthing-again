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

    const oof = scannedPeriod.id >= startPeriod ? scannedPeriod : currentPeriod;
    let resetsAt = startPeriod;
    while (resetsAt < oof.id) {
        resetsAt += weeks;
    }

    const foo = userStore.getPeriodForCharacter(now, char, resetsAt);
    return foo.startTime;
}
