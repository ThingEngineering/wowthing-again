export function getBaseScoreForKeyLevel(keyLevel: number): number {
    // 25 for completion
    // 10 for seasonal affix
    //  5 per normal affix
    //  5 per keystone level

    let affixes = 0;
    if (keyLevel < 5) {
        affixes = 1;
    } else if (keyLevel < 10) {
        affixes = 2;
    } else {
        affixes = 3;
    }
    return 70 + affixes * 10 + keyLevel * 7;
}
