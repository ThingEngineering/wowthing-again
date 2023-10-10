import type { AuctionsAppState } from '@/auctions/stores/state'
import { AuctionEntry, type AuctionEntryArray } from '@/auctions/types/auction-entry'
import type { AuctionData } from '@/types/data/auction'


class BrowseStore {
    private static url = '/api/auctions/browse'
    private cache: Record<string, AuctionEntry[]> = {}

    async fetch(
        auctionAppState: AuctionsAppState,
        auctionData: AuctionData,
        categoryId: number
    ): Promise<AuctionEntry[]> {
        let things: AuctionEntry[] = []

        const auctionCategory = auctionData.categoryMap[categoryId]
        if (!auctionCategory) {
            return []
        }

        const cacheKey = [
            auctionAppState.region,
            categoryId,
        ].join('--')

        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey]
        }
        else {
            const data = {
                region: auctionAppState.region,
                defaultFilter: auctionCategory.defaultFilter,
                inventoryType: auctionCategory.inventoryType,
                itemClass: auctionCategory.itemClass,
                itemSubclass: auctionCategory.itemSubClass,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(BrowseStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as AuctionEntryArray[]
                
                things = responseData.map((entryArray) => new AuctionEntry(...entryArray))
                things.sort((a, b) => a.lowestBuyoutPrice - b.lowestBuyoutPrice)

                this.cache[cacheKey] = things
            }
        }

        return things
    }
}
export const browseStore = new BrowseStore()
