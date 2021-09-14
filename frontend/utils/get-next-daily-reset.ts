import type {DateTime} from 'luxon'

import {resetTimes} from '@/data/region'
import type {Region} from '@/types/enums'


export default function getNextDailyReset(time: DateTime, region: Region): DateTime {
    if (time.year < 2000) {
        return time
    }

    const [resetHour, resetMin] = resetTimes[region].dailyResetTime

    let reset: DateTime = time.set({
        hour: resetHour,
        minute: resetMin,
        second: 0,
    })

    if (time.hour >= resetHour) {
        reset = reset.plus({days: 1})
    }

    return reset
}
