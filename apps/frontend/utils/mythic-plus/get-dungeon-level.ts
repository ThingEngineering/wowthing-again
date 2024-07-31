import { WeeklyActivityTier } from '@/shared/enums/weekly-activity-tier'
import type { CharacterWeeklyProgress } from '@/types'


export function getDungeonLevel(prog: CharacterWeeklyProgress): number {
    if (!prog || prog.progress < prog.threshold) {
        return -2
    }

    let level = prog.level
    if (prog.tier === WeeklyActivityTier.MythicDungeon) {
        level = 0
    }
    else if (prog.tier === WeeklyActivityTier.HeroicDungeon) {
        level = -1
    }
    return level
}
