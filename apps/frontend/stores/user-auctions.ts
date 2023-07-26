import { InventoryType, ItemClass, ItemFlags, WeaponSubclass } from '@/enums'
import type { AuctionState } from './local-storage'
import { UserAuctionDataAuction, type UserAuctionData, type UserAuctionDataPet, type UserAuctionDataMissingTransmogAuctionArray, UserAuctionDataMissingTransmogAuction } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import { sortAuctions, type SortableAuction } from '@/utils/auctions/sort-auctions'
import type { StaticData } from '@/types/data/static'


export type UserExtraPetEntry = {
    id: number
    name: string
    auctions: UserAuctionDataAuction[]
    pets: UserAuctionDataPet[]
}

export type UserAuctionEntry = {
    id: number,
    name: string,
    auctions: Partial<UserAuctionDataAuction>[]
}

export class UserAuctionExtraPetsStore {
    private static url = '/api/auctions/extra-pets'
    private cache: Record<string, UserExtraPetEntry[]> = {}

    async search(
        auctionState: AuctionState
    ): Promise<UserExtraPetEntry[]> {
        let things: UserExtraPetEntry[] = []

        const cacheKey = `${auctionState.extraPetsIgnoreJournal ? 1 : 0}`
        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey]
        }
        else {
            const data = {
                ignoreJournal: auctionState.extraPetsIgnoreJournal,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(UserAuctionExtraPetsStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as UserAuctionData

                responseData.auctions = {}
                for (const [creatureId, rawAuctions] of Object.entries(responseData.rawAuctions)) {
                    responseData.auctions[parseInt(creatureId)] = rawAuctions
                        .map((auctionArray) => new UserAuctionDataAuction(...auctionArray))
                }

                for (const creatureId in responseData.auctions) {
                    things.push({
                        id: parseInt(creatureId),
                        name: responseData.names[creatureId],
                        auctions: responseData.auctions[creatureId],
                        pets: responseData.pets[creatureId],
                    })
                }
            }
        }

        things = sortAuctions(auctionState.sortBy['extra-pets'], things)
        this.cache[cacheKey] = things
        return things
    }
}
export const userAuctionExtraPetsStore = new UserAuctionExtraPetsStore()

export class UserAuctionMissingDataStore {
    private static url = '/api/auctions/missing'
    private cache: Record<string, UserAuctionEntry[]> = {}

    async search(
        auctionState: AuctionState,
        type: string
    ): Promise<UserAuctionEntry[]> {
        let things: UserAuctionEntry[] = []

        const cacheKey = `${type}--${auctionState.region}--${auctionState.allRealms ? 1 : 0}--${auctionState.missingPetsMaxLevel ? 1 : 0}`
        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey]
        }
        else {
            const data = {
                allRealms: auctionState.allRealms,
                missingPetsMaxLevel: type === 'pets' && auctionState.missingPetsMaxLevel,
                region: parseInt(auctionState.region) || 0,
                type: type,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(UserAuctionMissingDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as UserAuctionData

                responseData.auctions = {}
                for (const [creatureId, rawAuctions] of Object.entries(responseData.rawAuctions)) {
                    responseData.auctions[parseInt(creatureId)] = rawAuctions
                        .map((auctionArray) => new UserAuctionDataAuction(...auctionArray))
                }
    
                if (responseData?.auctions) {
                    for (const thingId in responseData.auctions) {
                        things.push({
                            id: parseInt(thingId),
                            name: responseData.names[thingId],
                            auctions: responseData.auctions[thingId],
                        })
                    }
                }
            }
        }

        things = sortAuctions(auctionState.sortBy[`missing-${type}`], things)
        this.cache[cacheKey] = things
        return things
    }
}
export const userAuctionMissingStore = new UserAuctionMissingDataStore()


export class UserAuctionMissingTransmogDataStore {
    private static url = '/api/auctions/missing-transmog'
    private cache: Record<string, UserAuctionEntry[]> = {}

    async search(
        auctionState: AuctionState,
        itemData: ItemData,
        staticData: StaticData
    ): Promise<UserAuctionEntry[]> {
        let things: UserAuctionEntry[] = []

        const cacheKey = [
            auctionState.region,
            auctionState.allRealms ? '1' : '0',
            // auctionState.missingTransmogMinQuality.toString()
        ].join('--')

        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey]
        }
        else {
            const data = {
                allRealms: auctionState.allRealms,
                region: parseInt(auctionState.region) || 0,
            }

            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(UserAuctionMissingTransmogDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                const responseData = await response.json() as Record<string, UserAuctionDataMissingTransmogAuctionArray[]>

                const parsedData: Record<number, UserAuctionDataMissingTransmogAuction[]> = {}
                for (const [appearanceId, rawAuctions] of Object.entries(responseData)) {
                    parsedData[parseInt(appearanceId)] = rawAuctions
                        .map((auctionArray) => new UserAuctionDataMissingTransmogAuction(...auctionArray))
                }
    
                for (const [thingId, auctions] of Object.entries(parsedData)) {
                    const id = parseInt(thingId)
                    if (id === 0) {
                        continue
                    }

                    const item = itemData.items[auctions[0].itemId]
                    if (!item) {
                        continue
                    }

                    things.push({
                        id: parseInt(thingId),
                        name: item.name,
                        auctions,
                    })
                }
            }
        }

        things = sortAuctions(auctionState.sortBy['missing-transmog'], things as SortableAuction[], true)
        this.cache[cacheKey] = things

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
            const matchesName = item.name.toLocaleLowerCase().indexOf(nameLower) >= 0
            const matchesRealm = staticData.connectedRealms[thing.auctions[0].connectedRealmId]
                .realmNames
                .filter((name) => name.toLocaleLowerCase().indexOf(realmLower) >= 0)
                .length > 0

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

            return meetsMinQuality && matchesName && matchesRealm && matchesArmor && matchesWeapon
        })

        return things
    }
}
export const userAuctionMissingTransmogStore = new UserAuctionMissingTransmogDataStore()
