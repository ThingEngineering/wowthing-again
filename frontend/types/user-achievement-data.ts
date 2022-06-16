export interface UserAchievementData {
    achievements: Record<number, number>
    achievementCategories?: Record<number, UserAchievementDataCategory>
    achievementRecent?: number[]
    addonAchievements: Record<number, Record<number, UserAchievementDataAddonAchievement>>
    criteria: Record<number, number[][]>
    statistics: Record<number, [number, number, string][]>
}

export class UserAchievementDataAddonAchievement {
    criteria: number[]
    earned: boolean
}

export class UserAchievementDataCategory {
    constructor(
        public have: number,
        public points: number,
        public total: number
    ) {
    }
}
