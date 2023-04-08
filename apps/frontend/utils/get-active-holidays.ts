import every from 'lodash/every'
import { get } from 'svelte/store'
import type { DateTime } from 'luxon'

import { staticStore } from '@/stores'
import type { UserData } from '@/types'
import type { StaticDataHoliday } from '@/types/data/static'


type ActiveHolidays = Record<string, StaticDataHoliday>

const cachedActive: Record<number, ActiveHolidays> = {}
const cachedTime: Record<number, DateTime> = {}

export function getActiveHolidays(
    currentTime: DateTime,
    userData: UserData,
    ...regions: number[]
): ActiveHolidays {
    const regionMask = regions.reduce((a, b) => a + (1 << (b - 1)), 0)
    if (cachedTime[regionMask] === currentTime) {
        return cachedActive[regionMask]
    }

    const staticData = get(staticStore)

    const filteredHolidays = Object.values(staticData.holidays)
        .filter((holiday) => (holiday.regionMask & regionMask) > 0)

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
                            activeHolidays[taskKey] = holiday
                        }
                        break
                    }

                    actualStartDate = actualStartDate.plus({ hours: holiday.durations[0] + holiday.durations[1] })
                }
            }
            else {
                if (startDate < currentTime && startDate.plus({ hours: holiday.durations[0] }) > currentTime) {
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
