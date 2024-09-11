import type { CharacterWeeklyProgress } from '@/types';

export function getDungeonLevel(prog: CharacterWeeklyProgress): number {
    if (!prog || prog.progress < prog.threshold) {
        return -2;
    }

    console.log(prog);

    let level = prog.level;
    // Mythic
    if ([3, 11, 14].includes(prog.tier)) {
        level = 1;
    }
    // Heroic
    else if ([2, 10, 13].includes(prog.tier)) {
        level = 0;
    }
    return level;
}
