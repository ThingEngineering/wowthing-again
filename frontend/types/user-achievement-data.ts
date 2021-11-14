export interface UserAchievementData {
    achievements: Record<number, number>
    achievementCategories?: Record<number, UserAchievementDataCategory>
    achievementRecent?: number[]
    criteria: Record<number, number[][]>
}

export class UserAchievementDataCategory {
    constructor(
        public have: number,
        public points: number,
        public total: number
    ) {
    }
}
