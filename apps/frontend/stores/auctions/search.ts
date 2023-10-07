import type { AuctionsAppState } from '@/apps/auctions/state'
import { AuctionEntry, type AuctionEntryArray } from './types'


export class AuctionsSearchDataStore {
    private static url = '/api/auctions/search'
    private cache: Record<string, AuctionEntry[]> = {}

    async search(
        auctionAppState: AuctionsAppState,
        query: string
    ): Promise<AuctionEntry[]> {
        let things: AuctionEntry[] = []

        const cacheKey = [
            auctionAppState.region,
            query,
        ].join('--')

        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey]
        }
        else {
            const data = {
                region: auctionAppState.region,
                query,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(AuctionsSearchDataStore.url, {
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
export const auctionsSearchDataStore = new AuctionsSearchDataStore()
