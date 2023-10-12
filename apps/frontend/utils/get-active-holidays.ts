import every from 'lodash/every'
import { get } from 'svelte/store'
import type { DateTime } from 'luxon'

import { staticStore } from '@/shared/stores/static'
import type { Settings } from '@/types'
import type { StaticDataHoliday } from '@/shared/stores/static/types'
import { pvpBrawlHolidays } from '@/data/tasks'


type ActiveHolidays = Record<string, StaticDataHoliday>

const cachedActive: Record<number, ActiveHolidays> = {}
const cachedTime: Record<number, DateTime> = {}

export function getActiveHolidays(
    currentTime: DateTime,
    settings: Settings,
    ...regions: number[]
): ActiveHolidays {
    const regionMask = regions.reduce((a, b) => a + (1 << (b - 1)), 0)
    if (cachedTime[regionMask] === currentTime) {
        return cachedActive[regionMask]
    }

    const staticData = get(staticStore)

    const filteredHolidays = Object.values(staticData.holidays)
        .filter((holiday) => holiday.regionMask === 0 || (holiday.regionMask & regionMask) > 0)

    const activeHolidays: ActiveHolidays = {}
    for (const holiday of filteredHolidays) {
        const taskKeys = staticData.holidayIdToKeys[holiday.id]
        if (!taskKeys || every(taskKeys, (key) => activeHolidays[key])) {
            continue
        }

        for (const startDate of holiday.startDates) {
            // Repeats, duration0 is duration and duration1 is time between
            if (holiday.looping === 1) {
                let actualStartDate = startDate
                while (actualStartDate < currentTime) {
                    const endDate = actualStartDate.plus({ hours: holiday.durations[0] })
                    if (endDate > currentTime) {
                        for (const taskKey of taskKeys) {
                            if (taskKey === 'pvpBrawl') {
                                const disabledBrawls = settings.tasks.disabledChores['pvpBrawl'] || []
                                const brawlKey = pvpBrawlHolidays[holiday.id]
                                if (disabledBrawls.indexOf(brawlKey) >= 0) {
                                    continue
                                }
                            }
                            activeHolidays[taskKey] = holiday
                        }
                        break
                    }

                    actualStartDate = actualStartDate.plus({ hours: holiday.durations[0] + holiday.durations[1] })
                }
            }
            else {
                const actualStartDate = holiday.durations.length > 1
                    ? startDate.plus({ hours: holiday.durations[0] })
                    : startDate
                const endDate = actualStartDate.plus({ hours: holiday.durations[holiday.durations.length - 1] })

                if (actualStartDate < currentTime && endDate > currentTime) {
                    for (const taskKey of taskKeys) {
                        activeHolidays[taskKey] = holiday
                    }
                    break
                }
            }
        }
    }

    cachedActive[regionMask] = activeHolidays
    cachedTime[regionMask] = currentTime

    return activeHolidays
}
