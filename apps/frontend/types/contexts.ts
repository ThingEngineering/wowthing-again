import type { UserCount } from './user-count';

export interface CollectibleContext {
    countsKey: string;
    route: string;
    stats: Record<string, UserCount>;
    thingType: string;
    userHas: Set<number>;
    thingMapFunc?: (thing: number) => number;
    thingQualityFunc?: (thing: number) => number;
}
