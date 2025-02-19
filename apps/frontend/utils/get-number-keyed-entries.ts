export function getNumberKeyedEntries<TValue>(obj: Record<number, TValue>): [number, TValue][] {
    return Object.entries(obj).map(([key, value]) => [parseInt(key), value]);
}
