export function toNiceNumber(n: number): string {
    if (n >= 1000000 || n <= -100000) {
        // 2597600 -> 25.976 (divide by 100000) -> 25 (floor) -> 2.5 (divide by 10) -> 2.5m
        return `${(Math.floor(n / 100000) / 10).toFixed(1).toLocaleString()}m`;
    } else if (n >= 100000 || n <= -100000) {
        return `${Math.floor(n / 1000).toLocaleString()}k`;
    } else if (n >= 1000 || n <= -1000) {
        // 25976 -> 259.76 (divide by 100) -> 259 (floor) -> 25.9 (divide by 10) -> 25.9k
        return `${(Math.floor(n / 100) / 10).toFixed(1).toLocaleString()}k`;
    } else {
        return n.toString();
    }
}
