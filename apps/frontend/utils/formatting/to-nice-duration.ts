import { Duration } from 'luxon';

interface Options {
    includeZero?: boolean;
    maxDays?: number;
    useNbsp?: boolean;
}

export function toNiceDuration(milliseconds: number, options?: Options): string {
    const { includeZero = false, maxDays = 999, useNbsp = true } = options || {};

    const duration = Duration.fromObject({
        days: 0,
        hours: 0,
        minutes: 0,
        milliseconds,
    }).normalize();

    const parts = [];
    const space = useNbsp ? '&nbsp;' : ' ';

    if (duration.days > 0) {
        parts.push(`${duration.days}d`);
    }
    if (duration.days < maxDays) {
        if (duration.hours > 0 || (includeZero && parts.length >= 1)) {
            parts.push(`${duration.hours < 10 ? space : ''}${duration.hours}h`);
        }
        if (duration.minutes > 0 || includeZero) {
            parts.push(`${duration.minutes < 10 ? space : ''}${duration.minutes}m`);
        }
    }

    if (parts.length === 0) {
        parts.push('now');
    }

    return parts.slice(0, 2).join(' ');
}
