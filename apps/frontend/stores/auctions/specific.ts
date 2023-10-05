import type { AuctionData } from '@/types/data/auction'
import { UserAuctionDataAuction, type UserAuctionDataAuctionArray } from '@/types/data/user-auctions'


export type AuctionBrowseEntry = {
    groupKey: string,
    lowestBuyoutPrice: number,
    totalQuantity: number,
}

export class AuctionsSpecificDataStore {
    private static url = '/api/auctions/specific'
    private cache: Record<string, UserAuctionDataAuction[]> = {}

    async search(
        groupKey: string
    ): Promise<UserAuctionDataAuction[]> {
        let things: UserAuctionDataAuction[] = []

        const cacheKey = [
            1, // TODO region
            groupKey,
        ].join('--')

        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey]
        }
        else {
            const groupKeyParts = groupKey.split(':')

            const data = {
                region: 1, // TODO region
                appearanceSource: '',
                itemId: 0,
                petSpeciesId: 0,
            }

            if (groupKeyParts[0] === 'item') {
                data.itemId = parseInt(groupKeyParts[1])
            }
            else if (groupKeyParts[0] === 'pet') {
                data.petSpeciesId = parseInt(groupKeyParts[1])
            }
            else if (groupKeyParts[0] === 'source') {
                data.appearanceSource = groupKeyParts[1]
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(AuctionsSpecificDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as UserAuctionDataAuctionArray[]
                
                things = responseData.map((auctionArray) => new UserAuctionDataAuction(...auctionArray))
                things.sort((a, b) => a.buyoutPrice - b.buyoutPrice)

                // if (things[0].connectedRealmId > 100000) {
                    const temp: UserAuctionDataAuction[] = []
                    
                    for (const thing of things) {
                        if (temp.length === 0 || temp[temp.length - 1].buyoutPrice !== thing.buyoutPrice) {
                            temp.push(thing)
                        }
                        else {
                            temp[temp.length - 1].quantity += thing.quantity
                        }
                    }

                    things = temp
                // }

                console.log(things)

                this.cache[cacheKey] = things
            }
        }

        return things
    }
}
export const auctionsSpecificDataStore = new AuctionsSpecificDataStore()
