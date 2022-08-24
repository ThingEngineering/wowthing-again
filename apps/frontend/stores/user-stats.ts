import { WritableFancyStore } from '@/types'
import type { UserStatsData } from '@/types/data/user-stats';


export class UserStatsDataStore extends WritableFancyStore<UserStatsData> {
    setup(
    ): void {
        console.log('hi mum')
    }
}

export const userStatsStore = new UserStatsDataStore()
