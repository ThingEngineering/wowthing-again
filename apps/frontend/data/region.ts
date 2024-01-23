import { Region } from '@/enums/region'
import { iconLibrary } from '@/shared/icons'
import type { ResetTime } from '@/types'
import type { IconifyIcon } from '@iconify/types'

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

export const euLocales: Record<string, { icon: IconifyIcon, name: string }> = {
    deDE: {
        icon: iconLibrary.openmojiFlagGermany,
        name: 'Germany',
    },
    enGB: {
        icon: iconLibrary.openmojiFlagUnitedKingdom,
        name: 'United Kingdom',
    },
    esES: {
        icon: iconLibrary.openmojiFlagSpain,
        name: 'Spain',
    },
    frFR: {
        icon: iconLibrary.openmojiFlagFrance,
        name: 'France',
    },
    itIT: {
        icon: iconLibrary.openmojiFlagItaly,
        name: 'Italy',
    },
    ptPT: {
        icon: iconLibrary.openmojiFlagPortugal,
        name: 'Portugal',
    },
    ruRU: {
        icon: iconLibrary.openmojiFlagRussia,
        name: 'Russia',
    },
}
