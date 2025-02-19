export function hashObject(obj: object, skipKeys?: string[]): string {
    if (!obj) {
        return '';
    }

    const entries = Object.entries(obj);
    entries.sort();
    return entries
        .map(([key, value]) => {
            if (skipKeys?.indexOf(key) >= 0) {
                return `${key}_`;
            } else if (typeof value === 'object') {
                return `${key}_${hashObject(value)}`;
            } else {
                return `${key}_${value}`;
            }
        })
        .join('|');
}
