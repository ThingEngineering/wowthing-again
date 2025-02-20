export function toDigits(n: number, digits: number): string {
    return n.toLocaleString(undefined, {
        maximumFractionDigits: 0,
        minimumIntegerDigits: digits,
        useGrouping: false,
    });
}
