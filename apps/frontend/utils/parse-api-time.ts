import { DateTime } from 'luxon'


export default function parseApiTime(time: string): DateTime {
    return DateTime.fromISO(time, {zone: 'utc'})
}
