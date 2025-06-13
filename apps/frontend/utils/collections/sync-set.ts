export function syncSet<T>(current: Set<T>, newData: Iterable<T>) {
    const seen = new Set<T>();
    for (const newItem of newData) {
        current.add(newItem);
        seen.add(newItem);
    }

    const deleteMe = Array.from(current.values()).filter((currentItem) => !seen.has(currentItem));
    for (const deleteItem of deleteMe) {
        current.delete(deleteItem);
    }
}
