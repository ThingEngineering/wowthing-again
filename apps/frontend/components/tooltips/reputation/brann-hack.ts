export function brannHack(levelString: string): number {
    const level = parseInt(levelString);
    return Math.min(
        6,
        Math.max(
            1,
            level % 10 === 0
                ? Math.abs(9 - level / 10)
                : Math.floor(Math.abs(level + 0 - 80) / 10) + 2,
        ),
    );
}
