import { DateTime } from 'luxon'


export function toNiceTime(time: DateTime): string {
    return time.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
}
