import some from 'lodash/some'

import { sortAuctions, type SortableAuction } from '@/utils/auctions/sort-auctions'
import { type UserAuctionDataMissingRecipeAuctionArray, UserAuctionDataMissingRecipeAuction } from '@/types/data'
import type { UserData } from '@/types'
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
        staticData: StaticData,
        userData: UserData
    ): Promise<[UserAuctionEntry[], Record<number, number>]> {
        let things: UserAuctionEntry[] = []
        let updated: Record<number, number>

        const cacheKey = [
            auctionState.missingRecipeSearchType,
            auctionState.missingRecipeProfessionId,
            auctionState.missingRecipeSearchType === 'account'
                ? 0
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
                professionId: auctionState.missingRecipeProfessionId,
                region: parseInt(auctionState.region) || 0,
            }

            if (auctionState.missingRecipeSearchType === 'character') {
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
                        id: thingId,
                        name: item.name,
                        auctions,
                        hasItems: userData.itemsById[item.id] || [],
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

            const meetsHave = !auctionState.limitToHave || thing.hasItems.length > 0

            const meetsExpansion = auctionState.missingRecipeExpansion === -1
                || item.expansion === auctionState.missingRecipeExpansion 

            const meetsName = item.name.toLocaleLowerCase().indexOf(nameLower) >= 0
            const meetsRealm = some(
                thing.auctions.slice(0, auctionState.limitToCheapestRealm ? 1 : undefined),
                (auction) => staticData.connectedRealms[auction.connectedRealmId]
                    .realmNames
                    .filter((name) => name.toLocaleLowerCase().indexOf(realmLower) >= 0)
                    .length > 0
            )

            return meetsHave && meetsExpansion && meetsName && meetsRealm
        })

        return [things, updated]
    }
}
export const userAuctionMissingRecipeStore = new UserAuctionMissingRecipeDataStore()
