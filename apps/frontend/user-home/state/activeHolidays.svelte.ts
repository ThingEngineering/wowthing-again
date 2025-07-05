import type { DateTime } from 'luxon';

import { holidayMap } from '@/data/holidays';
import { Holiday } from '@/enums/holiday';
import { timeState } from '@/shared/state/time.svelte';
import { wowthingData } from '@/shared/stores/data';
import { userState } from '@/user-home/state/user';
import type { StaticDataHoliday } from '@/shared/stores/static/types';

export type ActiveHoliday = { holiday: StaticDataHoliday; startDate: DateTime; endDate: DateTime };
export type ActiveHolidayMap = Record<string, ActiveHoliday>;

class ActiveHolidays {
    private cachedActive: Record<number, ActiveHolidayMap> = {};
    private cachedTime: Record<number, DateTime> = {};

    value = $derived.by(() => {
        const allRegions = userState.general.allRegions || [];
        if (allRegions.length === 0) {
            return {} as ActiveHolidayMap;
        }

        const currentTime = timeState.time;

        const regionMask = allRegions.reduce((a, b) => a + (1 << (b - 1)), 0);
        if (this.cachedTime[regionMask] === currentTime) {
            return this.cachedActive[regionMask];
        }

        const filteredHolidays = Array.from(wowthingData.static.holidayById.values()).filter(
            (holiday) => holiday.regionMask === 0 || (holiday.regionMask & regionMask) > 0
        );

        const activeHolidays: ActiveHolidayMap = {};
        for (const holiday of filteredHolidays) {
            const taskKeys = wowthingData.static.holidayIdToKeys.get(holiday.id);
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
                                const holidayData = {
                                    holiday,
                                    startDate: actualStartDate,
                                    endDate,
                                };
                                activeHolidays[`h${holiday.id}`] = holidayData;
                                if (Holiday[holidayMap[holiday.id]].startsWith('Brawl')) {
                                    activeHolidays['pvpBrawl'] = holidayData;
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
                            activeHolidays[taskKey] = {
                                holiday,
                                startDate: actualStartDate,
                                endDate,
                            };
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
