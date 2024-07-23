export function cartesianProduct<T>(...allEntries: T[][]): T[][] {
    return allEntries.reduce((a, b) => a.flatMap((x) => b.map((y) => [...x, y])), [[]]);
}
