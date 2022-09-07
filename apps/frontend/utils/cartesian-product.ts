export function cartesianProduct<T>(...allEntries: T[][]): T[][] {
    return allEntries.reduce<T[][]>(
        (results, entries) =>
            results
                .map(result => entries.map(entry => [...result, entry] ))
                .reduce((subResults, result) => [...subResults, ...result], []),
        [[]]
    )
}
