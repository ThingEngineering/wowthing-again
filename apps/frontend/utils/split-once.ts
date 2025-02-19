export function splitOnce(s: string, separator: string): string[] {
    const [first, ...rest] = s.split(separator);
    return [first, rest.length > 0 ? rest.join(separator) : null];
}
