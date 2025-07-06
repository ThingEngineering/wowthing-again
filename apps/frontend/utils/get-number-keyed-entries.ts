export function getNumberKeyedEntries<TValue>(obj: Record<number, TValue>): [number, TValue][] {
    return Object.entries(obj).map(([key, value]) => [parseInt(key), value]);
}

export function getNumberKeys(obj: Record<number, unknown>): number[] {
    return Object.keys(obj).map((key) => parseInt(key));
}
