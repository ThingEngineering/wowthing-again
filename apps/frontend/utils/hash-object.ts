export function hashObject(obj: object): string {
    const entries = Object.entries(obj)
    entries.sort()
    return entries.map(([key, value]) => {
        if (typeof value === 'object') {
            return `${key}_${hashObject(value)}`
        }
        return `${key}_${value}`
    }).join('|')
}
