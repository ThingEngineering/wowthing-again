import type { AchievementDataCriteriaTree } from '@/types';

export interface AchievementStatus {
    characters: [number, number][];
    criteriaTrees: AchievementDataCriteriaTree[][];
    rootCriteriaTree: AchievementDataCriteriaTree;
    total: number;
}
