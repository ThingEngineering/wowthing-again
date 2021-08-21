import type { Dictionary } from './dictionary'


export interface UserAchievementData {
    achievements: Dictionary<number>
    achievementCategories?: Dictionary<UserAchievementDataCategory>
    achievementRecent?: number[]
    criteria: Dictionary<number[][]>
}

export class UserAchievementDataCategory {
    constructor(
        public have: number,
        public points: number,
        public total: number
    ) {
    }
}
