import type { AchievementDataCriteriaTree } from '@/types';

export interface AchievementStatus {
    characterCounts: [number, number][];
    criteriaCharacters: Record<number, [number, number][]>;
    criteriaTrees: AchievementDataCriteriaTree[][];
    oneCriteria: boolean;
    reputation: boolean;
    rootCriteriaTree: AchievementDataCriteriaTree;
    total: number;
}
