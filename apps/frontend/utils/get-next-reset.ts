import type { DateTime } from 'luxon'

import { resetTimes } from '@/data/region'
import type { Region } from '@/enums'
import parseApiTime from '@/utils/parse-api-time'


export function getNextDailyReset(timeString: string, region: Region): DateTime {
    const time = parseApiTime(timeString)
    if (time.year < 2000) {
        return time
    }

    return getNextDailyResetFromTime(time, region)
}

export function getNextDailyResetFromTime(time: DateTime, region: Region): DateTime {
    const [resetHour, resetMin] = resetTimes[region].dailyResetTime

    let reset: DateTime = time.set({
        hour: resetHour,
        minute: resetMin,
        second: -1,
        millisecond: 0,
    })

    if (time.hour >= resetHour) {
        reset = reset.plus({days: 1})
    }

    return reset
}

function getResetTime(time: DateTime, resetDay: number, resetHour: number, resetMin: number): DateTime {
    let reset: DateTime = time.set({
        hour: resetHour,
        minute: resetMin,
        second: 0,
    })

    if (time.hour >= resetHour) {
        reset = reset.plus({days: 1})
    }

    if (reset.weekday < resetDay) {
        reset = reset.plus({days: resetDay - reset.weekday})
    }
    else if (reset.weekday > resetDay) {
        reset = reset.plus({days: 7 - reset.weekday + resetDay})
    }

    return reset
}

export function getNextWeeklyReset(timeString: string, region: Region): DateTime {
    const time = parseApiTime(timeString)
    if (time.year < 2000) {
        return time.plus({minutes: 1})
    }

    return getNextWeeklyResetFromTime(time, region)
}

export function getNextWeeklyResetFromTime(time: DateTime, region: Region): DateTime {
    const resetDay = resetTimes[region].weeklyResetDay
    const [resetHour, resetMin] = resetTimes[region].weeklyResetTime

    return getResetTime(time, resetDay, resetHour, resetMin)
}

export function getNextBiWeeklyReset(timeString: string, region: Region): DateTime {
    const time = parseApiTime(timeString)
    if (time.year < 2000) {
        return time.plus({minutes: 1})
    }

    const resetDay = resetTimes[region].biWeeklyResetDay
    const [resetHour, resetMin] = resetTimes[region].biWeeklyResetTime

    const resetTime = getResetTime(time, resetDay, resetHour, resetMin)
    const weeklyResetTime = getNextWeeklyReset(timeString, region)

    return resetTime < weeklyResetTime ? resetTime : weeklyResetTime
}
