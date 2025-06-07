import type { DateTime } from 'luxon';
import { get } from 'svelte/store';

import { holidayMap } from '@/data/holidays';
import { Holiday } from '@/enums/holiday';
import { timeState } from '@/shared/state/time.svelte';
import { staticStore } from '@/shared/stores/static';
import { userState } from '@/user-home/state/user';
import type { StaticDataHoliday } from '@/shared/stores/static/types';

export type ActiveHolidayMap = Record<string, StaticDataHoliday>;

class ActiveHolidays {
    private cachedActive: Record<number, ActiveHolidayMap> = {};
    private cachedTime: Record<number, DateTime> = {};

    value = $derived.by(() => {
        const allRegions = userState.general.allRegions || [];
        if (allRegions.length === 0) {
            return {} as ActiveHolidayMap;
        }

        const currentTime = timeState.time;
        const staticData = get(staticStore);

        const regionMask = allRegions.reduce((a, b) => a + (1 << (b - 1)), 0);
        if (this.cachedTime[regionMask] === currentTime) {
            return this.cachedActive[regionMask];
        }

        const filteredHolidays = Object.values(staticData.holidays).filter(
            (holiday) => holiday.regionMask === 0 || (holiday.regionMask & regionMask) > 0
        );

        const activeHolidays: ActiveHolidayMap = {};
        for (const holiday of filteredHolidays) {
            const taskKeys = staticData.holidayIdToKeys[holiday.id];
            if (!taskKeys || taskKeys.every((key) => activeHolidays[key])) {
                continue;
            }

            for (const startDate of holiday.startDates) {
                // Repeats, duration0 is duration and duration1 is time between
                if (holiday.looping === 1) {
                    let actualStartDate = startDate;
                    while (actualStartDate < currentTime) {
                        const endDate = actualStartDate.plus({ hours: holiday.durations[0] });
                        if (endDate > currentTime) {
                            if (holidayMap[holiday.id]) {
                                activeHolidays[`h${holiday.id}`] = holiday;
                                if (Holiday[holidayMap[holiday.id]].startsWith('Brawl')) {
                                    activeHolidays['pvpBrawl'] = holiday;
                                }
                            }
                            break;
                        }

                        actualStartDate = endDate.plus({ hours: holiday.durations[1] });
                    }
                } else {
                    const actualStartDate =
                        holiday.durations.length > 1
                            ? startDate.plus({ hours: holiday.durations[0] })
                            : startDate;
                    const endDate = actualStartDate.plus({
                        hours: holiday.durations[holiday.durations.length - 1],
                    });

                    if (actualStartDate < currentTime && endDate > currentTime) {
                        for (const taskKey of taskKeys) {
                            activeHolidays[taskKey] = holiday;
                        }
                        break;
                    }
                }
            }
        }

        this.cachedActive[regionMask] = activeHolidays;
        this.cachedTime[regionMask] = currentTime;

        return activeHolidays;
    });
}

export const activeHolidays = new ActiveHolidays();
