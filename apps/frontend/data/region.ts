import { Region } from '@/enums/region';
import { iconLibrary } from '@/shared/icons';
import type { ResetTime } from '@/types';
import type { IconifyIcon } from '@iconify/types';

// Times are [hour, minute] in UTC
export const resetTimes: Record<Region, ResetTime> = {
    [Region.US]: {
        dailyResetTime: [15, 0], // 7am/8am
        weeklyResetDay: 2, // Tuesday
        weeklyResetTime: [15, 0], // 7am/8am
        biWeeklyResetDay: 5, // Friday
        biWeeklyResetTime: [3, 0], // 7pm/8pm
    },
    // FIXME copied US
    [Region.KR]: {
        dailyResetTime: [15, 0], // 7am/8am
        weeklyResetDay: 2, // Tuesday
        weeklyResetTime: [15, 0], // 7am/8am
        biWeeklyResetDay: 5, // Friday
        biWeeklyResetTime: [3, 0], // 7pm/8pm
    },
    [Region.EU]: {
        dailyResetTime: [7, 0], // 7am/8am
        weeklyResetDay: 3, // Wednesday
        weeklyResetTime: [7, 0], // 7am/8am
        biWeeklyResetDay: 6, // Saturday
        biWeeklyResetTime: [19, 0], // 7pm/8pm
    },
    // FIXME copied US
    [Region.TW]: {
        dailyResetTime: [15, 0], // 7am/8am
        weeklyResetDay: 2, // Tuesday
        weeklyResetTime: [15, 0], // 7am/8am
        biWeeklyResetDay: 5, // Friday
        biWeeklyResetTime: [3, 0], // 7pm/8pm
    },
};

export const euLocales: Record<string, { icon: IconifyIcon; name: string }> = {
    deDE: {
        icon: iconLibrary.twemojiFlagGermany,
        name: 'Germany',
    },
    enGB: {
        icon: iconLibrary.twemojiFlagUnitedKingdom,
        name: 'United Kingdom',
    },
    esES: {
        icon: iconLibrary.twemojiFlagSpain,
        name: 'Spain',
    },
    frFR: {
        icon: iconLibrary.twemojiFlagFrance,
        name: 'France',
    },
    itIT: {
        icon: iconLibrary.twemojiFlagItaly,
        name: 'Italy',
    },
    ptPT: {
        icon: iconLibrary.twemojiFlagPortugal,
        name: 'Portugal',
    },
    ruRU: {
        icon: iconLibrary.twemojiFlagRussia,
        name: 'Russia',
    },
};
