import type {
    AchievementDataAchievement,
    AchievementDataAchievementArray,
    AchievementDataCategory,
    AchievementDataCriteria,
    AchievementDataCriteriaArray,
    AchievementDataCriteriaTree,
    AchievementDataCriteriaTreeArray,
} from '@/types/achievement-data';

export interface RawAchievements {
    achievementRaw: AchievementDataAchievementArray[];
    categories: AchievementDataCategory[];
    criteriaRaw: AchievementDataCriteriaArray[];
    criteriaTreeRaw: AchievementDataCriteriaTreeArray[];
    hideIds: number[];
}

export class DataAchievements {
    public achievementById = new Map<number, AchievementDataAchievement>();
    public categories: AchievementDataCategory[] = [];
    public criteriaById = new Map<number, AchievementDataCriteria>();
    public criteriaTreeById = new Map<number, AchievementDataCriteriaTree>();
    public isHidden: Record<number, boolean> = {};

    public achievementToCategory: Record<number, number> = {};
}
