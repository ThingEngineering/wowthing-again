import { sortAuctions, type SortableAuction } from '@/utils/auctions/sort-auctions'
import { type UserAuctionDataMissingRecipeAuctionArray, UserAuctionDataMissingRecipeAuction } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import type { StaticData } from '@/types/data/static'
import type { AuctionState } from '../local-storage'
import type { UserAuctionEntry } from '../user-auctions'


export class UserAuctionMissingRecipeDataStore {
    private static url = '/api/auctions/missing-recipes'
    private cache: Record<string, [UserAuctionEntry[], Record<number, number>]> = {}

    async search(
        auctionState: AuctionState,
        itemData: ItemData,
        staticData: StaticData
    ): Promise<[UserAuctionEntry[], Record<number, number>]> {
        let things: UserAuctionEntry[] = []
        let updated: Record<number, number>

        const cacheKey = [
            auctionState.missingRecipeSearchType,
            auctionState.missingRecipeSearchType === 'account'
                ? auctionState.missingRecipeProfessionId
                : auctionState.missingRecipeCharacterId,
            auctionState.missingRecipeSearchType === 'account'
                ? auctionState.region
                : 0,
            auctionState.allRealms ? '1' : '0',
        ].join('--')

        if (this.cache[cacheKey]) {
            [things, updated] = this.cache[cacheKey]
        }
        else {
            const data = {
                allRealms: auctionState.allRealms,
                characterId: 0,
                professionId: 0,
                region: parseInt(auctionState.region) || 0,
            }

            if (auctionState.missingRecipeSearchType === 'account') {
                data.professionId = auctionState.missingRecipeProfessionId
            }
            else {
                data.characterId = auctionState.missingRecipeCharacterId
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(UserAuctionMissingRecipeDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as {
                    auctions: Record<string, UserAuctionDataMissingRecipeAuctionArray[]>,
                    updated: Record<number, number>,
                }
                updated = responseData.updated

                const parsedData: Record<number, UserAuctionDataMissingRecipeAuction[]> = {}
                for (const [itemId, rawAuctions] of Object.entries(responseData.auctions)) {
                    parsedData[parseInt(itemId)] = rawAuctions
                        .map((auctionArray) => new UserAuctionDataMissingRecipeAuction(...auctionArray))
                }
    
                for (const [thingId, auctions] of Object.entries(parsedData)) {
                    const id = parseInt(thingId)

                    const item = itemData.items[id]
                    if (!item) {
                        continue
                    }

                    things.push({
                        id,
                        name: item.name,
                        auctions,
                    })
                }
            }
        }

        things = sortAuctions(auctionState.sortBy['missing-recipes'], things as SortableAuction[], true) as UserAuctionEntry[]
        this.cache[cacheKey] = [things, updated]

        const nameLower = auctionState.missingRecipeNameSearch.toLocaleLowerCase()
        const realmLower = auctionState.missingRecipeRealmSearch.toLocaleLowerCase()
        things = things.filter((thing) => {
            const item = itemData.items[thing.auctions[0].itemId]

            const matchesName = item.name.toLocaleLowerCase().indexOf(nameLower) >= 0
            const matchesRealm = staticData.connectedRealms[thing.auctions[0].connectedRealmId]
                .realmNames
                .filter((name) => name.toLocaleLowerCase().indexOf(realmLower) >= 0)
                .length > 0

            return matchesName && matchesRealm
        })

        return [things, updated]
    }
}
export const userAuctionMissingRecipeStore = new UserAuctionMissingRecipeDataStore()