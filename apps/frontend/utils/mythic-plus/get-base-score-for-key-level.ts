export function getBaseScoreForKeyLevel(keyLevel: number): number {
    // 25 for completion
    // 10 for seasonal affix
    //  5 per normal affix
    //  5 per keystone level

    let affixes = 0
    if (keyLevel <= 3) {
        affixes = 1
    }
    else if (keyLevel <= 6) {
        affixes = 2
    }
    else if (keyLevel <= 9) {
        affixes = 3
    }
    else {
        affixes = 5
    }
    return 25 + (affixes * 5) + (Math.max(2, Math.min(10, keyLevel)) * 5) + (Math.max(0, keyLevel - 10) * 7)
}
