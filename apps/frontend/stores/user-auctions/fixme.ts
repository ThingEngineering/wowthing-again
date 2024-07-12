import { get } from 'svelte/store';

import { staticStore } from '@/shared/stores/static';
import {
    UserAuctionDataAuction,
    type UserAuctionData,
    type UserAuctionDataPet,
} from '@/types/data';
import { sortAuctions } from '@/utils/auctions/sort-auctions';
import type { HasNameAndRealm, UserItem } from '@/types/shared';
import type { AuctionState } from '../local-storage';

export type UserExtraPetEntry = {
    id: number;
    name: string;
    auctions: UserAuctionDataAuction[];
    pets: UserAuctionDataPet[];
};

type MangledAuctionType = Partial<Omit<UserAuctionDataAuction, 'bidPrice' | 'buyoutPrice'>> &
    Pick<UserAuctionDataAuction, 'bidPrice' | 'buyoutPrice'>;

export type UserAuctionEntry = {
    id: string;
    name: string;
    auctions: MangledAuctionType[];
    hasItems?: [HasNameAndRealm, UserItem[]][];
};

export class UserAuctionExtraPetsStore {
    private static url = '/api/auctions/extra-pets';
    private cache: Record<string, UserExtraPetEntry[]> = {};

    async search(auctionState: AuctionState): Promise<UserExtraPetEntry[]> {
        let things: UserExtraPetEntry[] = [];

        const cacheKey = `${auctionState.extraPetsIgnoreJournal ? 1 : 0}`;
        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey];
        } else {
            const data = {
                ignoreJournal: auctionState.extraPetsIgnoreJournal,
            };

            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(UserAuctionExtraPetsStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = (await response.json()) as UserAuctionData;

                responseData.auctions = {};
                for (const [creatureId, rawAuctions] of Object.entries(responseData.rawAuctions)) {
                    responseData.auctions[parseInt(creatureId)] = rawAuctions.map(
                        (auctionArray) => new UserAuctionDataAuction(...auctionArray),
                    );
                }

                const staticData = get(staticStore);
                for (const petId in responseData.auctions) {
                    const pet = staticData.pets[petId];
                    things.push({
                        id: pet.creatureId,
                        name: pet.name,
                        auctions: responseData.auctions[petId],
                        pets: responseData.pets[petId],
                    });
                }
                console.log(things);
            }
        }

        things = sortAuctions(auctionState.sortBy['extra-pets'], things);
        this.cache[cacheKey] = things;
        return things;
    }
}
export const userAuctionExtraPetsStore = new UserAuctionExtraPetsStore();

export class UserAuctionMissingDataStore {
    private static url = '/api/auctions/missing';
    private cache: Record<string, UserAuctionEntry[]> = {};

    async search(auctionState: AuctionState, type: string): Promise<UserAuctionEntry[]> {
        let things: UserAuctionEntry[] = [];

        const petsMaxLevel = type === 'pets' && auctionState.missingPetsMaxLevel;
        const petsNeedMaxLevel =
            type === 'pets' &&
            auctionState.missingPetsMaxLevel &&
            auctionState.missingPetsNeedMaxLevel;

        const cacheKey = [
            auctionState.region,
            auctionState.allRealms ? '1' : '0',
            auctionState.includeRussia ? '1' : '0',
            type,
            petsMaxLevel,
            petsNeedMaxLevel,
        ].join('--');

        if (this.cache[cacheKey]) {
            things = this.cache[cacheKey];
        } else {
            const region = parseInt(auctionState.region) || 0;
            const data = {
                allRealms: auctionState.allRealms,
                includeRussia: region === 3 ? auctionState.includeRussia : false,
                missingPetsMaxLevel: petsMaxLevel,
                missingPetsNeedMaxLevel: petsNeedMaxLevel,
                region,
                type: type,
            };

            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(UserAuctionMissingDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = (await response.json()) as UserAuctionData;

                responseData.auctions = {};
                for (const [creatureId, rawAuctions] of Object.entries(responseData.rawAuctions)) {
                    responseData.auctions[parseInt(creatureId)] = rawAuctions.map(
                        (auctionArray) => new UserAuctionDataAuction(...auctionArray),
                    );
                }

                if (responseData?.auctions) {
                    for (const thingId in responseData.auctions) {
                        things.push({
                            id: thingId,
                            name: responseData.names[thingId],
                            auctions: responseData.auctions[thingId],
                        });
                    }
                }
            }
        }

        things = sortAuctions(auctionState.sortBy[`missing-${type}`], things);
        this.cache[cacheKey] = things;
        return things;
    }
}
export const userAuctionMissingStore = new UserAuctionMissingDataStore();
