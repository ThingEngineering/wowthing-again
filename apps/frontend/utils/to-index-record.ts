export function toIndexRecord<Key extends number | string>(values: Key[]): Record<Key, number> {
    return Object.fromEntries(values.map((value, index) => [value, index])) as Record<Key, number>;
}
