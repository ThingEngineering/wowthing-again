import type { MultiSlugParams } from '@/types';

export function shiftParams(params: MultiSlugParams, shiftBy = 1): MultiSlugParams {
    const ret: Record<string, string> = {};
    for (let i = 1 + shiftBy; i <= 9; i++) {
        ret[`slug${i - shiftBy}`] = params[`slug${i}`];
    }
    return ret as MultiSlugParams;
}
