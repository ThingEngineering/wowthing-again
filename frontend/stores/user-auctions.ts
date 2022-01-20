import { WritableFancyStore } from '@/types'
import type { UserAuctionData } from '@/types/data'


export class UserAuctionDataStore extends WritableFancyStore<UserAuctionData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/auctions'
        }
        return url
    }

    initialize(userHistoryData: UserAuctionData): void {
        console.time('UserAuctionDataStore.initialize')

        console.timeEnd('UserAuctionDataStore.initialize')
    }
}

export const userAuctionStore = new UserAuctionDataStore()
