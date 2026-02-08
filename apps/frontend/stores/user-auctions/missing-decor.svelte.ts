import { wowthingData } from '@/shared/stores/data';
import { sortAuctions, type SortableAuction } from '@/utils/auctions/sort-auctions';
import {
    type UserAuctionDataMissingRecipeAuctionArray,
    UserAuctionDataMissingRecipeAuction,
} from '@/types/data';
import { userState } from '@/user-home/state/user';
import type { AuctionState } from '../local-storage';
import type { UserAuctionEntry } from '.';
import type { Settings } from '@/shared/stores/settings/types';

export class UserAuctionMissingDecorDataStore {
    private static url = '/api/auctions/missing-decor';
    private cache: Record<string, [UserAuctionEntry[], Record<number, number>]> = {};

    async search(
        settings: Settings,
        auctionState: AuctionState
    ): Promise<[UserAuctionEntry[], Record<number, number>]> {
        let things: UserAuctionEntry[] = [];
        let updated: Record<number, number>;

        const cacheKey = [
            auctionState.region,
            auctionState.allRealms ? '1' : '0',
            auctionState.includeRussia ? '1' : '0',
        ].join('|');

        if (this.cache[cacheKey]) {
            [things, updated] = this.cache[cacheKey];
        } else {
            const region = parseInt(auctionState.region) || 0;
            const data = {
                allRealms: auctionState.allRealms,
                includeRussia: region === 3 ? auctionState.includeRussia : false,
                region: parseInt(auctionState.region) || 0,
            };

            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(UserAuctionMissingDecorDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const userItemsById = userState.general.itemsById;

                const responseData = (await response.json()) as {
                    auctions: Record<string, UserAuctionDataMissingRecipeAuctionArray[]>;
                    updated: Record<number, number>;
                };
                updated = responseData.updated;

                const parsedData: Record<number, UserAuctionDataMissingRecipeAuction[]> = {};
                for (const [itemIdString, rawAuctions] of Object.entries(responseData.auctions)) {
                    const itemId = parseInt(itemIdString);
                    parsedData[itemId] = rawAuctions.map(
                        (auctionArray) => new UserAuctionDataMissingRecipeAuction(...auctionArray)
                    );
                }

                for (const [thingId, auctions] of Object.entries(parsedData)) {
                    const id = parseInt(thingId);

                    const item = wowthingData.items.items[id];
                    if (!item) {
                        continue;
                    }

                    things.push({
                        id: thingId,
                        name: item.name,
                        auctions,
                        hasItems: userItemsById[item.id] || [],
                    });
                }
            }
        }

        things = sortAuctions(
            auctionState.sortBy['missing-decor'],
            things as SortableAuction[],
            true
        ) as UserAuctionEntry[];
        this.cache[cacheKey] = [things, updated];

        const nameLower = auctionState.missingDecorNameSearch.toLocaleLowerCase();
        const realmLower = auctionState.missingDecorRealmSearch.toLocaleLowerCase();
        things = things.filter((thing) => {
            const item = wowthingData.items.items[thing.auctions[0].itemId];

            const meetsDontHave = auctionState.showDontHave || thing.hasItems.length > 0;
            const meetsHave = auctionState.showHave || thing.hasItems.length === 0;

            const meetsName = item.name.toLocaleLowerCase().indexOf(nameLower) >= 0;
            const meetsRealm = thing.auctions
                .slice(0, auctionState.limitToCheapestRealm ? 1 : undefined)
                .some(
                    (auction) =>
                        wowthingData.static.connectedRealmById
                            .get(auction.connectedRealmId)
                            .realmNames.filter(
                                (name) => name.toLocaleLowerCase().indexOf(realmLower) >= 0
                            ).length > 0
                );

            return meetsDontHave && meetsHave && meetsName && meetsRealm;
        });

        return [things, updated];
    }
}
export const userAuctionMissingDecorStore = new UserAuctionMissingDecorDataStore();
