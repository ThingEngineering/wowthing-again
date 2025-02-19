import type { UserCount } from '@/types';

export default function getPercentClass(percent: number | UserCount): string {
    if (percent === undefined) {
        return 'quality1';
    }

    let per: number;
    if (typeof percent === 'number') {
        per = percent;
    } else {
        per = (percent.have / percent.total) * 100;
    }

    if (per >= 100) {
        return 'quality5';
    } else if (per >= 75) {
        return 'quality4';
    } else if (per >= 50) {
        return 'quality3';
    } else if (per >= 25) {
        return 'quality2';
    } else {
        return 'quality1';
    }
}
