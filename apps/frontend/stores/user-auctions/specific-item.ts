import { UserAuctionDataMissingRecipeAuction, type UserAuctionData, UserAuctionDataAuction } from '@/types/data'
import type { UserData } from '@/types'
import type { ItemData } from '@/types/data/item'
import type { AuctionState } from '../local-storage'
import type { UserAuctionEntry } from '../user-auctions'

export class UserAuctionSpecificItemDataStore {
    private static url = '/api/auctions/specific-item'
    private cache: Record<string, [UserAuctionEntry[], Record<number, number>]> = {}

    async search(
        auctionState: AuctionState,
        itemData: ItemData,
        userData: UserData,
        itemId: number
    ): Promise<[UserAuctionEntry[], Record<number, number>]> {
        let things: UserAuctionEntry[] = []
        let updated: Record<number, number>

        const cacheKey = [
            auctionState.region,
            auctionState.allRealms ? '1' : '0',
            auctionState.includeRussia ? '1' : '0',
            itemId,
        ].join('--')

        if (this.cache[cacheKey]) {
            [things, updated] = this.cache[cacheKey]
        }
        else {
            const region = parseInt(auctionState.region) || 0
            const data = {
                allRealms: auctionState.allRealms,
                includeRussia: region === 3 ? auctionState.includeRussia : false,
                region: parseInt(auctionState.region) || 0,
                itemId,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(UserAuctionSpecificItemDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as UserAuctionData
                console.log(responseData)
                // updated = responseData.updated

                const parsedData: Record<number, UserAuctionDataMissingRecipeAuction[]> = {}
                for (const [itemId, rawAuctions] of Object.entries(responseData.rawAuctions)) {
                    parsedData[parseInt(itemId)] = rawAuctions
                        .map((auctionArray) => new UserAuctionDataAuction(...auctionArray))
                }
    
                for (const [thingId, auctions] of Object.entries(parsedData)) {
                    const id = parseInt(thingId)

                    const item = itemData.items[id]
                    if (!item) {
                        continue
                    }

                    things.push({
                        id: thingId,
                        name: item.name,
                        auctions,
                        hasItems: userData.itemsById[item.id] || [],
                    })
                }
            }
        }

        this.cache[cacheKey] = [things, updated]

        return [things, updated]
    }

}
export const userAuctionSpecificItemStore = new UserAuctionSpecificItemDataStore()
