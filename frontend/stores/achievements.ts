import type { AchievementData } from '@/types'
import { WritableFancyStore } from '@/types'


export class AchievementDataStore extends WritableFancyStore<AchievementData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-achievements')
    }
}

export const achievementStore = new AchievementDataStore()
