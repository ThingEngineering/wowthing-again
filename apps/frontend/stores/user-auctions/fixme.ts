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
import { ItemQuality } from '@/enums/item-quality';

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
            }
        }

        things = sortAuctions(auctionState.sortBy['extra-pets'], things);
        this.cache[cacheKey] = things;
        return things;
    }
}
export const userAuctionExtraPetsStore = new UserAuctionExtraPetsStore();

type AuctionCache = [UserAuctionEntry[], Record<number, number>];

export class UserAuctionMissingDataStore {
    private static url = '/api/auctions/missing';
    private cache: Record<string, AuctionCache> = {};

    async search(auctionState: AuctionState, type: string): Promise<AuctionCache> {
        let things: UserAuctionEntry[] = [];
        let updated: Record<number, number>;

        const petsMaxLevel = type === 'pets' && auctionState.missingPetsMaxLevel;
        const petsNeedMaxLevel = petsMaxLevel && auctionState.missingPetsNeedMaxLevel;

        const cacheKey = [
            auctionState.region,
            auctionState.allRealms,
            auctionState.includeBids,
            auctionState.includeRussia,
            type,
            petsMaxLevel,
            petsNeedMaxLevel,
        ].join('--');

        if (this.cache[cacheKey]) {
            [things, updated] = this.cache[cacheKey];
        } else {
            const region = parseInt(auctionState.region) || 0;
            const data = {
                allRealms: auctionState.allRealms,
                includeBids: auctionState.includeBids,
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

                updated = responseData.updated;

                if (responseData?.auctions) {
                    for (const [thingId, auctions] of Object.entries(responseData.auctions)) {
                        let filteredAuctions: MangledAuctionType[] = [];
                        if (petsMaxLevel) {
                            let minQuality = -1;
                            for (const auction of auctions) {
                                if (
                                    auction.petQuality > minQuality ||
                                    auction.petQuality === ItemQuality.Rare
                                ) {
                                    filteredAuctions.push(auction);
                                    minQuality = auction.petQuality;
                                }
                            }
                        } else {
                            filteredAuctions = auctions;
                        }

                        things.push({
                            id: thingId,
                            name: responseData.names[parseInt(thingId)],
                            auctions: filteredAuctions,
                        });
                    }
                }
            }
        }

        things = sortAuctions(
            auctionState.sortBy[`missing-${type}`],
            things,
            !auctionState.includeBids,
        );
        this.cache[cacheKey] = [things, updated];
        return [things, updated];
    }
}
export const userAuctionMissingStore = new UserAuctionMissingDataStore();
