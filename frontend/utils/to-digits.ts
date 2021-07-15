export default function toDigits(n: number, digits: number): string {
    return n.toLocaleString(undefined, { minimumIntegerDigits: digits})
}
