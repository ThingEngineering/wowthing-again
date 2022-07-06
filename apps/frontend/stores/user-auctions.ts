import { WritableFancyStore } from '@/types'
import type { UserAuctionData } from '@/types/data'


export class UserAuctionDataStore extends WritableFancyStore<UserAuctionData> {
    private type: string

    constructor(type: string, data: UserAuctionData = null) {
        super(data)
        this.type = type
    }

    get dataUrl(): string {
        return `/api/auctions/${this.type}`
    }

    /*initialize(userHistoryData: UserAuctionData): void {
        console.time('UserAuctionDataStore.initialize')

        console.timeEnd('UserAuctionDataStore.initialize')
    }*/
}

export const userAuctionExtraPetStore = new UserAuctionDataStore('extra-pets')
export const userAuctionMissingMountStore = new UserAuctionDataStore('missing-mounts')
export const userAuctionMissingPetStore = new UserAuctionDataStore('missing-pets')
export const userAuctionMissingToyStore = new UserAuctionDataStore('missing-toys')
