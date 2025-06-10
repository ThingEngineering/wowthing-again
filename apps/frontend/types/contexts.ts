import type { UserCount } from './user-count';

export interface CollectibleContext {
    countsKey: string;
    route: string;
    stats: Record<string, UserCount>;
    thingMapFunc: (thing: number) => number;
    thingType: string;
    userHas: Set<number>;
}
