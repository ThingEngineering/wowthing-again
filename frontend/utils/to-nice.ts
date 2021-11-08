import { DateTime, Duration } from 'luxon'


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

export function toNiceDuration(milliseconds: number): string {
    const duration = Duration.fromObject({
        days: 0,
        hours: 0,
        minutes: 0,
        milliseconds,
    }).normalize()

    const parts = []

    if (duration.days > 0) {
        parts.push(`${duration.days}d`)
    }
    if (duration.hours > 0) {
        parts.push(`${duration.hours < 10 ? '&nbsp;' : ''}${duration.hours}h`)
    }
    if (duration.minutes > 0) {
        parts.push(`${duration.minutes < 10 ? '&nbsp;' : ''}${duration.minutes}m`)

    }

    return parts.slice(0, 2).join(' ')
}
