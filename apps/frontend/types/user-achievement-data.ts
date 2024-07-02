export interface UserAchievementData {
    achievements: Record<number, number>;
    achievementCategories?: Record<number, UserAchievementDataCategory>;
    achievementRecent?: number[];
    addonAchievements: Record<number, Record<number, UserAchievementDataAddonAchievement>>;
    rawCriteria: [number, ...number[][]][];
    statistics: Record<number, [number, number, string][]>;

    criteria: Record<number, number[][]>;
}

export class UserAchievementDataAddonAchievement {
    criteria: number[];
    earned: boolean;
}

export class UserAchievementDataCategory {
    constructor(
        public have: number,
        public total: number,
        public havePoints: number,
        public totalPoints: number,
    ) {}
}
