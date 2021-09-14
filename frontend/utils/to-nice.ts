import {DateTime} from 'luxon'


export function toNiceNumber(n: number): string {
    if (n >= 1000) {
        // 25976 -> 259.76 (divide by 100) -> 259 (floor) -> 25.9 (divide by 10) -> 25.9k
        return `${(Math.floor(n / 100) / 10).toFixed(1).toLocaleString()}k`
    }
    else {
        return n.toString()
    }
}

export function toNiceTime(time: DateTime): string {
    return time.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
}
