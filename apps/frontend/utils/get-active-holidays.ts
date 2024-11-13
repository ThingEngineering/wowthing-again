import { get } from 'svelte/store';
import type { DateTime } from 'luxon';

import { pvpBrawlHolidays } from '@/data/tasks';
import { staticStore } from '@/shared/stores/static';
import type { StaticDataHoliday } from '@/shared/stores/static/types';
import type { SettingsView } from '@/shared/stores/settings/types';

type ActiveHolidays = Record<string, StaticDataHoliday>;

const cachedActive: Record<number, ActiveHolidays> = {};
const cachedTime: Record<number, DateTime> = {};

export function getActiveHolidays(
    currentTime: DateTime,
    activeView: SettingsView,
    ...regions: number[]
): ActiveHolidays {
    const regionMask = regions.reduce((a, b) => a + (1 << (b - 1)), 0);
    if (cachedTime[regionMask] === currentTime) {
        return cachedActive[regionMask];
    }

    const staticData = get(staticStore);

    const filteredHolidays = Object.values(staticData.holidays).filter(
        (holiday) => holiday.regionMask === 0 || (holiday.regionMask & regionMask) > 0,
    );

    const activeHolidays: ActiveHolidays = {};
    for (const holiday of filteredHolidays) {
        const taskKeys = staticData.holidayIdToKeys[holiday.id];
        if (!taskKeys || taskKeys.every((key) => activeHolidays[key])) {
            continue;
        }

        for (const startDate of holiday.startDates) {
            // Repeats, duration0 is duration and duration1 is time between
            if (holiday.looping === 1) {
                let actualStartDate = addOffset(startDate, holiday.regionMask);
                while (actualStartDate < currentTime) {
                    const endDate = actualStartDate.plus({ hours: holiday.durations[0] });
                    if (endDate > currentTime) {
                        for (const taskKey of taskKeys) {
                            if (taskKey === 'pvpBrawl') {
                                const disabledBrawls = activeView.disabledChores['pvpBrawl'] || [];
                                const brawlKey = pvpBrawlHolidays[holiday.id];
                                if (disabledBrawls.indexOf(brawlKey) >= 0) {
                                    continue;
                                }
                            }
                            activeHolidays[taskKey] = holiday;
                        }
                        break;
                    }

                    actualStartDate = endDate.plus({ hours: holiday.durations[1] });
                }
            } else {
                const actualStartDate = addOffset(
                    holiday.durations.length > 1
                        ? startDate.plus({ hours: holiday.durations[0] })
                        : startDate,
                    holiday.regionMask,
                );
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

    cachedActive[regionMask] = activeHolidays;
    cachedTime[regionMask] = currentTime;

    return activeHolidays;
}

function addOffset(dateTime: DateTime, regionMask: number): DateTime {
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
