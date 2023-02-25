import { Duration } from 'luxon'


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
