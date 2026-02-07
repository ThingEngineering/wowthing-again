import type { DateTime } from 'luxon';

import { timeState } from '@/shared/state/time.svelte';
import { wowthingData } from '@/shared/stores/data';
import { userState } from '@/user-home/state/user';
import type { StaticDataHoliday } from '@/shared/stores/static/types';
import { holidayIds } from '@/data/holidays';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

export type ActiveHoliday = {
    holiday: StaticDataHoliday;
    startDate: DateTime;
    endDate: DateTime;
    soon?: boolean;
};
export type ActiveHolidayMap = Record<number, ActiveHoliday>;

class ActiveHolidays {
    private cachedActive: Record<number, ActiveHolidayMap> = {};
    private cachedTime: Record<number, DateTime> = {};

    value = $derived.by(() => {
        console.time('activeHolidays');
        const allRegions = userState.general.allRegions || [];
        if (allRegions.length === 0) {
            return {} as ActiveHolidayMap;
        }

        const currentTime = timeState.slowTime;
        const fakeStartTime = currentTime.plus({ days: 2 });

        const regionMask = allRegions.reduce((a, b) => a + (1 << (b - 1)), 0);
        if (this.cachedTime[regionMask] === currentTime) {
            return this.cachedActive[regionMask];
        }

        const filteredHolidays = Array.from(wowthingData.static.holidayById.values()).filter(
            (holiday) =>
                holiday.durations.length > 0 &&
                (holiday.regionMask === 0 || (holiday.regionMask & regionMask) > 0)
        );

        const activeHolidays: ActiveHolidayMap = {};
        const setActive = (holiday: StaticDataHoliday, data: ActiveHoliday) => {
            for (const [holidayEnum, [nameIds, descriptionIds]] of getNumberKeyedEntries(
                holidayIds
            )) {
                const actualDescriptionIds = descriptionIds || [];
                if (
                    nameIds.includes(holiday.nameId) &&
                    (actualDescriptionIds.length === 0 ||
                        actualDescriptionIds.includes(holiday.descriptionId))
                ) {
                    activeHolidays[holidayEnum] = data;
                }
            }
        };

        for (const holiday of filteredHolidays) {
            // const taskKeys = wowthingData.static.holidayIdToKeys.get(holiday.id);
            // if (!taskKeys || taskKeys.every((key) => activeHolidays[key])) {
            //     continue;
            // }

            for (const startDate of holiday.startDates) {
                // Repeats, duration0 is duration and duration1 is time between
                if (holiday.looping === 1) {
                    let actualStartDate = startDate;
                    let escapeCounter = 0;
                    while (actualStartDate < currentTime) {
                        escapeCounter++;
                        if (escapeCounter > 1000) {
                            console.error('looping holiday took WAY too long!', holiday);
                            break;
                        }

                        const endDate = actualStartDate.plus({ hours: holiday.durations[0] });
                        if (endDate > currentTime) {
                            const holidayData = {
                                holiday,
                                startDate: actualStartDate,
                                endDate,
                            };
                            setActive(holiday, holidayData);
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

                    if (actualStartDate < fakeStartTime && endDate > currentTime) {
                        const holidayData = {
                            holiday,
                            startDate: actualStartDate,
                            endDate,
                            soon: actualStartDate > currentTime,
                        };
                        setActive(holiday, holidayData);
                        break;
                    }
                }
            }
        }

        this.cachedActive[regionMask] = activeHolidays;
        this.cachedTime[regionMask] = currentTime;

        console.log(activeHolidays);

        console.timeEnd('activeHolidays');
        return activeHolidays;
    });
}

export const activeHolidays = new ActiveHolidays();
