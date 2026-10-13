import {
    UserAuctionDataAuction,
    type UserAuctionDataAuctionArray,
} from '@/types/data/user-auctions';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

export type RecipesData = Record<number, Record<number, UserAuctionDataAuction[]>>;
type RecipesResponse = Record<
    number,
    {
        rawAuctions: Record<number, UserAuctionDataAuctionArray[]>;
    }
>;

export class RecipesAuctionsStore {
    private static url = '/api/auctions/recipes';
    private cache: RecipesData = null;

    async fetch(): Promise<RecipesData> {
        let ret: RecipesData;

        if (this.cache !== null) {
            ret = this.cache;
        } else {
            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(RecipesAuctionsStore.url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
            });

            ret = {};
            if (response.ok) {
                const responseData = (await response.json()) as RecipesResponse;

                for (const [region, itemAuctions] of getNumberKeyedEntries(responseData)) {
                    ret[region] = {};

                    for (const [itemId, rawAuctions] of getNumberKeyedEntries(
                        itemAuctions.rawAuctions
                    )) {
                        ret[region][itemId] = rawAuctions.map(
                            (auctionArray) => new UserAuctionDataAuction(...auctionArray)
                        );
                    }
                }
            }

            this.cache = ret;
        }

        return ret;
    }
}
export const recipesAuctionStore = new RecipesAuctionsStore();
