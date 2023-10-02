import { Region } from '@/enums/region'
import type { ResetTime } from '@/types'

// Times are [hour, minute] in UTC
export const resetTimes: Record<Region, ResetTime> = {
    [Region.US]: {
        dailyResetTime: [15, 0], // 7am/8am
        weeklyResetDay: 2, // Tuesday
        weeklyResetTime: [15, 0], // 7am/8am
        biWeeklyResetDay: 5, // Friday
        biWeeklyResetTime: [3, 0], // 7pm/8pm
    },
    [Region.KR]: null,
    [Region.EU]: {
        dailyResetTime: [7, 0], // 7am/8am
        weeklyResetDay: 3, // Wednesday
        weeklyResetTime: [7, 0], // 7am/8am
        biWeeklyResetDay: 6, // Saturday
        biWeeklyResetTime: [19, 0], // 7pm/8pm
    },
    [Region.TW]: null,
}
