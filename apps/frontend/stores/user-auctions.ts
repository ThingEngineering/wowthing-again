import sortBy from 'lodash/sortBy'
import { get } from 'svelte/store'

import { staticStore } from './static'
import type { AuctionState } from './local-storage'
import type { UserAuctionData, UserAuctionDataAuction, UserAuctionDataPet } from '@/types/data'


export type UserExtraPetEntry = {
    id: number
    name: string
    auctions: UserAuctionDataAuction[]
    pets: UserAuctionDataPet[]
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

        const sortState = auctionState.sortBy['extra-pets'] || 'name_up'
        if (sortState === 'name_down') {
            things = sortBy(things, (item) => item.name)
            things.reverse()
        }
        else if (sortState === 'price_up') {
            things = sortBy(things, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
        }
        else if (sortState === 'price_down') {
            things = sortBy(things, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
            things.reverse()
        }
        // name_up is default
        else {
            things = sortBy(things, (item) => item.name)
        }

        this.cache[cacheKey] = things
        return things
    }
}
export const userAuctionExtraPetsStore = new UserAuctionExtraPetsStore()

export type UserAuctionEntry = { id: number, name: string, auctions: UserAuctionDataAuction[] }

export class UserAuctionMissingDataStore {
    private static url = '/api/auctions/missing'
    private cache: Record<string, UserAuctionEntry[]> = {}

    async search(
        auctionState: AuctionState,
        type: string
    ): Promise<UserAuctionEntry[]> {
        let things: UserAuctionEntry[] = []

        const cacheKey = `${type}--${auctionState.missingPetsMaxLevel ? 1 : 0}`
        if (this.cache[cacheKey]) {
            things =  this.cache[cacheKey]
        }
        else {
            const data = {
                missingPetsMaxLevel: type === 'pets' && auctionState.missingPetsMaxLevel,
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

                if (responseData?.auctions) {
                    const regionId = parseInt(auctionState.region)
                    const staticData = get(staticStore).data

                    for (const thingId in responseData.auctions) {
                        let auctions = responseData.auctions[thingId]
                        if (regionId > 0) {
                            auctions = auctions.filter((auction) =>
                                staticData.connectedRealms[auction.connectedRealmId].region === regionId)
                            if (auctions.length === 0) {
                                continue
                            }
                        }
        
                        things.push({
                            id: parseInt(thingId),
                            name: responseData.names[thingId],
                            auctions: auctions,
                        })
                    }
                }
            }
        }
        
        const sortState = auctionState.sortBy[`missing-${type}`] || 'name_up'
        if (sortState === 'name_down') {
            things = sortBy(things, (item) => item.name)
            things.reverse()
        }
        else if (sortState === 'price_up') {
            things = sortBy(things, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
        }
        else if (sortState === 'price_down') {
            things = sortBy(things, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
            things.reverse()
        }
        // name_up is default
        else {
            things = sortBy(things, (item) => item.name)
        }

        this.cache[cacheKey] = things
        return things
    }
}
export const userAuctionMissingStore = new UserAuctionMissingDataStore()
