export function nazjatarHack(levelString: string): number {
    const level = parseInt(levelString.split(' ')[1]);
    return level === 30 ? 1 : 7 - Math.max(1, Math.floor(level / 5));
}

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

export function valeeraHack(levelString: string): number {
    const level = parseInt(levelString);
    if (level >= 51) {
        return 1;
    } else if (level >= 41) {
        return 2;
    } else if (level >= 31) {
        return 3;
    } else if (level >= 21) {
        return 4;
    } else if (level >= 11) {
        return 5;
    } else {
        return 6;
    }
}
