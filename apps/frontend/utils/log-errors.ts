export function logErrors<T>(func: () => T): T {
    try {
        return func();
    } catch (e) {
        console.error(e);
    }
}
