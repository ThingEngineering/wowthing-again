import type { AuctionState } from '../local-storage'
import { UserAuctionDataAuction, type UserAuctionData, type UserAuctionDataPet } from '@/types/data'
import { sortAuctions } from '@/utils/auctions/sort-auctions'


export type UserExtraPetEntry = {
    id: number
    name: string
    auctions: UserAuctionDataAuction[]
    pets: UserAuctionDataPet[]
}

type MangledAuctionType = Partial<Omit<UserAuctionDataAuction, 'bidPrice' | 'buyoutPrice'>>
    & Pick<UserAuctionDataAuction, 'bidPrice' | 'buyoutPrice'>

export type UserAuctionEntry = {
    id: string,
    name: string,
    auctions: MangledAuctionType[]
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
                            id: thingId,
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

