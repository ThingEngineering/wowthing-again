export function brannHack(levelString: string): number {
    const level = parseInt(levelString);
    if (level >= 91) {
        return 1;
    } else if (level >= 71) {
        return 2;
    } else if (level >= 51) {
        return 3;
    } else if (level >= 31) {
        return 4;
    } else if (level >= 11) {
        return 5;
    } else {
        return 6;
    }
}
