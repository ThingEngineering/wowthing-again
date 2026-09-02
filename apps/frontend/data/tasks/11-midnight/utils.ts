import { timeState } from '@/shared/state/time.svelte';
import type { DateTime } from 'luxon';

export const twoWeekDecorator = (expires: DateTime) => {
    const daysRemaining = expires.diff(timeState.slowTime).toMillis() / 1000 / 86400;
    if (daysRemaining < 7) {
        return 'decorator-warn';
    } else {
        return 'decorator-success';
    }
};
