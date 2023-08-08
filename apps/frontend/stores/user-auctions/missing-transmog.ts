import some from 'lodash/some'

import { ItemFlags, InventoryType, ItemClass, WeaponSubclass } from '@/enums'
import { sortAuctions, type SortableAuction } from '@/utils/auctions/sort-auctions'
import { type UserAuctionDataMissingTransmogAuctionArray, UserAuctionDataMissingTransmogAuction } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import type { StaticData } from '@/types/data/static'
import type { AuctionState } from '../local-storage'
import type { UserAuctionEntry } from '../user-auctions'


export class UserAuctionMissingTransmogDataStore {
    private static url = '/api/auctions/missing-appearance-'
    private cache: Record<string, [UserAuctionEntry[], Record<number, number>]> = {}

    async search(
        auctionState: AuctionState,
        itemData: ItemData,
        staticData: StaticData,
        searchType: string
    ): Promise<[UserAuctionEntry[], Record<number, number>]> {
        let things: UserAuctionEntry[] = []
        let updated: Record<number, number>

        const cacheKey = [
            searchType,
            auctionState.region,
            auctionState.allRealms ? '1' : '0',
        ].join('--')

        if (this.cache[cacheKey]) {
            [things, updated] = this.cache[cacheKey]
        }
        else {
            const data = {
                allRealms: auctionState.allRealms,
                region: parseInt(auctionState.region) || 0,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(UserAuctionMissingTransmogDataStore.url + searchType, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as {
                    auctions: Record<string, UserAuctionDataMissingTransmogAuctionArray[]>,
                    updated: Record<number, number>
                }
                updated = responseData.updated

                const parsedData: Record<string, UserAuctionDataMissingTransmogAuction[]> = {}
                for (const [auctionKey, rawAuctions] of Object.entries(responseData.auctions)) {
                    parsedData[auctionKey] = rawAuctions
                        .map((auctionArray) => new UserAuctionDataMissingTransmogAuction(...auctionArray))
                }
    
                for (const [thingId, auctions] of Object.entries(parsedData)) {
                    if (thingId === '0') {
                        continue
                    }

                    const item = itemData.items[auctions[0].itemId]
                    if (!item) {
                        continue
                    }

                    things.push({
                        id: thingId,
                        name: item.name,
                        auctions,
                    })
                }
            }
        }

        things = sortAuctions(auctionState.sortBy['missing-transmog'], things as SortableAuction[], true) as UserAuctionEntry[]
        this.cache[cacheKey] = [things, updated]

        const nameLower = auctionState.missingTransmogNameSearch.toLocaleLowerCase()
        const realmLower = auctionState.missingTransmogRealmSearch.toLocaleLowerCase()
        things = things.filter((thing) => {
            const item = itemData.items[thing.auctions[0].itemId]
            if ((item.flags & ItemFlags.CannotTransmogToThisItem) > 0) {
                return false
            }

            // Why doesn't profession gear have the above flag? WHO KNOWS
            if (item.inventoryType === InventoryType.ProfessionGear ||
                item.inventoryType === InventoryType.ProfessionTool) {
                return false
            }

            // These are weird fake weapons
            if (
                item.classId === ItemClass.Weapon &&
                (
                    item.subclassId === WeaponSubclass.Miscellaneous
                    || item.subclassId === WeaponSubclass.Thrown
                )
            ) {
                return false
            }

            const meetsMinQuality = item.quality >= auctionState.missingTransmogMinQuality

            const matchesExpansion = auctionState.missingTransmogExpansion === -1
                || item.expansion === auctionState.missingTransmogExpansion 
            
            const matchesName = item.name.toLocaleLowerCase().indexOf(nameLower) >= 0
            const matchesRealm = some(
                thing.auctions.slice(0, auctionState.limitToCheapestRealm ? 1 : undefined),
                (auction) => staticData.connectedRealms[auction.connectedRealmId]
                    .realmNames
                    .filter((name) => name.toLocaleLowerCase().indexOf(realmLower) >= 0)
                    .length > 0
            )

            let matchesArmor = true
            if (auctionState.missingTransmogItemClass === 'armor') {
                if (item.classId !== ItemClass.Armor) {
                    matchesArmor = false
                }
                if (
                    auctionState.missingTransmogItemSubclassArmor >= 0 &&
                    item.subclassId !== auctionState.missingTransmogItemSubclassArmor
                ) {
                    matchesArmor = false
                }
            }

            let matchesWeapon = true
            if (auctionState.missingTransmogItemClass === 'weapon') {
                if (item.classId !== ItemClass.Weapon) {
                    matchesWeapon = false
                }
                if (
                    auctionState.missingTransmogItemSubclassWeapon >= 0 &&
                    item.subclassId !== auctionState.missingTransmogItemSubclassWeapon
                ) {
                    matchesWeapon = false
                }
            }

            return meetsMinQuality && matchesExpansion && matchesName && matchesRealm && matchesArmor && matchesWeapon
        })

        return [things, updated]
    }
}
export const userAuctionMissingTransmogStore = new UserAuctionMissingTransmogDataStore()
