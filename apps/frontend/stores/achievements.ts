import {
    AchievementDataAchievement,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    WritableFancyStore
} from '@/types'
import type { AchievementData } from '@/types'


export class AchievementDataStore extends WritableFancyStore<AchievementData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-achievements')
    }
    
    initialize(data: AchievementData): void {
        if (data.achievementRaw !== null) {
            data.achievement = {}
            for (const rawAchievement of data.achievementRaw) {
                const obj = new AchievementDataAchievement(...rawAchievement)
                data.achievement[obj.id] = obj
            }
            data.achievementRaw = null

            data.criteria = {}
            for (const rawCriteria of data.criteriaRaw) {
                const obj = new AchievementDataCriteria(...rawCriteria)
                data.criteria[obj.id] = obj
            }
            data.criteriaRaw = null

            data.criteriaTree = {}
            for (const rawCriteriaTree of data.criteriaTreeRaw) {
                const obj = new AchievementDataCriteriaTree(...rawCriteriaTree)
                data.criteriaTree[obj.id] = obj
            }
            data.criteriaTreeRaw = null
        }

    }
}

export const achievementStore = new AchievementDataStore()
