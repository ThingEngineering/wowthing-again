import { WritableFancyStore } from '@/types/fancy-store'
import { AuctionCategory, type AuctionData } from '@/types/data/auction'


export class AuctionDataStore extends WritableFancyStore<AuctionData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-auction')
    }

    initialize(data: AuctionData) {
        console.time('AuctionDataStore.initialize')

        if (data.rawCategories) {
            data.categories = []
            data.categoryMap = {}
            for (const categoryArray of data.rawCategories) {
                const obj = new AuctionCategory(...categoryArray)
                data.categories.push(obj)
                data.categoryMap[obj.id] = obj
            }
            data.rawCategories = null
        }

        console.timeEnd('AuctionDataStore.initialize')
    }
}

export const auctionStore = new AuctionDataStore()
