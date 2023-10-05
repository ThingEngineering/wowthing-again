import type { AuctionData } from '@/types/data/auction'


export type AuctionBrowseEntry = {
    groupKey: string,
    lowestBuyoutPrice: number,
    totalQuantity: number,
}

export class AuctionsBrowseDataStore {
    private static url = '/api/auctions/browse'
    private cache: Record<string, AuctionBrowseEntry[]> = {}

    async search(
        auctionData: AuctionData,
        categoryId: number
    ): Promise<AuctionBrowseEntry[]> {
        let things: AuctionBrowseEntry[] = []

        const auctionCategory = auctionData.categoryMap[categoryId]
        if (!auctionCategory) {
            return []
        }

        const cacheKey = [
            1, // TODO region
            categoryId,
        ].join('--')

        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey]
        }
        else {
            const data = {
                region: 1, // TODO region
                inventoryType: auctionCategory.inventoryType,
                itemClass: auctionCategory.itemClass,
                itemSubclass: auctionCategory.itemSubClass,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(AuctionsBrowseDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as AuctionBrowseEntry[]
                console.log(responseData)

                things = responseData
                things.sort((a, b) => a.lowestBuyoutPrice - b.lowestBuyoutPrice)

                this.cache[cacheKey] = things
            }
        }

        return things
    }
}
export const auctionsBrowseDataStore = new AuctionsBrowseDataStore()
