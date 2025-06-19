import { derived } from 'svelte/store';
import type { DateTime } from 'luxon';

import { holidayMap } from '@/data/holidays';
import { Holiday } from '@/enums/holiday';
import { wowthingData } from '@/shared/stores/data';
import { timeStore } from '@/shared/stores/time';
import { userState } from '@/user-home/state/user';
import type { StaticDataHoliday } from '@/shared/stores/static/types';

export type ActiveHolidays = Record<string, StaticDataHoliday>;

const cachedActive: Record<number, ActiveHolidays> = {};
const cachedTime: Record<number, DateTime> = {};

export const activeHolidays = derived([timeStore], ([$timeStore]) => {
    const allRegions = userState.general.allRegions || [];
    if (allRegions.length === 0) {
        return {} as ActiveHolidays;
    }

    const regionMask = allRegions.reduce((a, b) => a + (1 << (b - 1)), 0);
    // console.log('activeHolidays', regionMask);
    if (cachedTime[regionMask] === $timeStore) {
        return cachedActive[regionMask];
    }

    const filteredHolidays = Array.from(wowthingData.static.holidayById.values()).filter(
        (holiday) => holiday.regionMask === 0 || (holiday.regionMask & regionMask) > 0
    );

    const activeHolidays: ActiveHolidays = {};
    for (const holiday of filteredHolidays) {
        const taskKeys = wowthingData.static.holidayIdToKeys.get(holiday.id);
        if (!taskKeys || taskKeys.every((key) => activeHolidays[key])) {
            continue;
        }

        for (const startDate of holiday.startDates) {
            // Repeats, duration0 is duration and duration1 is time between
            if (holiday.looping === 1) {
                let actualStartDate = startDate;
                while (actualStartDate < $timeStore) {
                    const endDate = actualStartDate.plus({ hours: holiday.durations[0] });
                    if (endDate > $timeStore) {
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
                const actualStartDate = addOffset(
                    holiday.durations.length > 1
                        ? startDate.plus({ hours: holiday.durations[0] })
                        : startDate
                    //holiday.regionMask,
                );
                const endDate = actualStartDate.plus({
                    hours: holiday.durations[holiday.durations.length - 1],
                });

                if (actualStartDate < $timeStore && endDate > $timeStore) {
                    for (const taskKey of taskKeys) {
                        activeHolidays[taskKey] = holiday;
                    }
                    break;
                }
            }
        }
    }

    cachedActive[regionMask] = activeHolidays;
    cachedTime[regionMask] = $timeStore;

    return activeHolidays;
});

function addOffset(dateTime: DateTime /*, regionMask: number*/): DateTime {
    // US
    // if (regionMask === 1) {
    //     return dateTime.plus({ hours: -7 });
    // }
    // // EU
    // else if (regionMask === 4) {
    //     return dateTime.minus({ hours: 1 });
    // } else {
    return dateTime;
    // }
}
