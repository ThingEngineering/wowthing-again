export function toNicePrice(n: number): string {
    if (n >= 100_00_00) {
        return `${Math.floor(n / 10000).toLocaleString()} g`;
    } else if (n >= 1_00_00) {
        return `${(Math.floor(n / 1000) / 10).toLocaleString()} g`;
    } else if (n >= 1_00) {
        return `${(Math.floor(n / 10) / 10).toLocaleString()} s`;
    } else {
        return `${n} c`;
    }
}
