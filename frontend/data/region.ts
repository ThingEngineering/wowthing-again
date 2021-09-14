import {Region} from '@/types/enums'
import type {ResetTime} from '@/types'

export const resetTimes: Record<Region, ResetTime> = {
    [Region.US]: {
        dailyResetTime: [15, 0],
        weeklyResetDay: 2, // Tuesday
        weeklyResetTime: [15, 0],
    },
    [Region.KR]: null,
    [Region.EU]: {
        dailyResetTime: [7, 0],
        weeklyResetDay: 3, // Wednesday
        weeklyResetTime: [7, 0],
    },
    [Region.TW]: null,
}
