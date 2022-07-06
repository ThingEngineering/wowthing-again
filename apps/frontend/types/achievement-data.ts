import { AchievementFlags, CriteriaTreeFlags } from '@/types/enums'
import type { CriteriaType } from '@/types/enums/criteria-type'


export interface AchievementData {
    categories: AchievementDataCategory[]

    achievement: Record<number, AchievementDataAchievement>
    criteria: Record<number, AchievementDataCriteria>
    criteriaTree: Record<number, AchievementDataCriteriaTree>

    achievementRaw: AchievementDataAchievementArray[]
    criteriaRaw: AchievementDataCriteriaArray[]
    criteriaTreeRaw: AchievementDataCriteriaTreeArray[]
}

export interface AchievementDataCategory {
    id: number
    name: string
    slug: string
    achievementIds: number[]
    children: AchievementDataCategory[]
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
    )
    { }

    get isAccountWide(): boolean {
        return (this.flags & AchievementFlags.AccountWide) > 0
    }

    get isProgressBar(): boolean {
        return (this.flags & AchievementFlags.Counter) > 0 || (this.flags & AchievementFlags.ProgressBar) > 0
    }
}

type AchievementDataAchievementArray = ConstructorParameters<typeof AchievementDataAchievement>

export class AchievementDataCriteria {
    constructor(
        public id: number,
        public asset: number,
        public modifierTreeId: number,
        public type: CriteriaType,
    )
    { }
}

type AchievementDataCriteriaArray = ConstructorParameters<typeof AchievementDataCriteria>

export class AchievementDataCriteriaTree {
    constructor(
        public id: number,
        public amount: number,
        public criteriaId: number,
        public flags: number,
        public operator: number,
        public description: string,
        public children: number[],
    )
    { }

    get isProgressBar() : boolean {
        return (this.flags & CriteriaTreeFlags.ProgressBar) > 0
    }
}

type AchievementDataCriteriaTreeArray = ConstructorParameters<typeof AchievementDataCriteriaTree>
