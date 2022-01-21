import { WritableFancyStore } from '@/types'
import type { UserAuctionData } from '@/types/data'


export class UserAuctionDataStore extends WritableFancyStore<UserAuctionData> {
    private type: string

    constructor(type: string, data: UserAuctionData = null) {
        super(data)
        this.type = type
    }

    get dataUrl(): string {
        return `/api/auctions/missing-${this.type}`
    }

    /*initialize(userHistoryData: UserAuctionData): void {
        console.time('UserAuctionDataStore.initialize')

        console.timeEnd('UserAuctionDataStore.initialize')
    }*/
}

export const userAuctionMissingMountStore = new UserAuctionDataStore('mounts')
export const userAuctionMissingPetStore = new UserAuctionDataStore('pets')
export const userAuctionMissingToyStore = new UserAuctionDataStore('toys')
