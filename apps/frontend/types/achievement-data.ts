import { AchievementFlags, CriteriaTreeFlags } from '@/enums/wow';
import type { CriteriaType } from '@/enums/criteria-type';

export interface AchievementData {
    achievementToCategory: Record<number, number>;
    categories: AchievementDataCategory[];

    achievement: Record<number, AchievementDataAchievement>;
    criteria: Record<number, AchievementDataCriteria>;
    criteriaTree: Record<number, AchievementDataCriteriaTree>;
    isHidden: Record<number, boolean>;

    achievementRaw: AchievementDataAchievementArray[];
    criteriaRaw: AchievementDataCriteriaArray[];
    criteriaTreeRaw: AchievementDataCriteriaTreeArray[];
    hideIds: number[];
}

export interface AchievementDataCategory {
    id: number;
    name: string;
    slug: string;
    achievementIds: Array<number | number[]>;
    children: AchievementDataCategory[];
}

export class AchievementDataAchievement {
    constructor(
        public id: number,
        public categoryId: number,
        public criteriaTreeId: number,
        public faction: number,
        public flags: number,
        public minimumCriteria: number,
        public order: number,
        public points: number,
        public supersededBy: number,
        public supersedes: number,
        public description: string,
        public name: string,
        public reward: string,
    ) {}

    get isAccountWide(): boolean {
        return (this.flags & AchievementFlags.AccountWide) > 0;
    }

    get isProgressBar(): boolean {
        return (
            (this.flags & AchievementFlags.Counter) > 0 ||
            (this.flags & AchievementFlags.ProgressBar) > 0
        );
    }
}

type AchievementDataAchievementArray = ConstructorParameters<typeof AchievementDataAchievement>;

export class AchievementDataCriteria {
    constructor(
        public id: number,
        public asset: number,
        public modifierTreeId: number,
        public type: CriteriaType,
    ) {}
}

type AchievementDataCriteriaArray = ConstructorParameters<typeof AchievementDataCriteria>;

export class AchievementDataCriteriaTree {
    constructor(
        public id: number,
        public amount: number,
        public criteriaId: number,
        public flags: number,
        public operator: number,
        public description: string,
        public children: number[],
    ) {}

    hasFlag(flag: CriteriaTreeFlags): boolean {
        return (this.flags & flag) > 0;
    }

    get isProgressBar(): boolean {
        return this.hasFlag(CriteriaTreeFlags.ProgressBar);
    }

    get isAllianceOnly(): boolean {
        return this.hasFlag(CriteriaTreeFlags.AllianceOnly);
    }

    get isHordeOnly(): boolean {
        return this.hasFlag(CriteriaTreeFlags.HordeOnly);
    }
}

type AchievementDataCriteriaTreeArray = ConstructorParameters<typeof AchievementDataCriteriaTree>;
