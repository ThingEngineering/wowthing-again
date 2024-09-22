export type CommodityData = {
    regions: Record<number, Record<number, number>>;
};

export class AuctionsCommoditiesSpecificStore {
    private static url = '/api/auctions/commodities-specific';

    private cache: CommodityData = null;
    private cacheKey: string = null;

    async search(regionIds: number[], itemIds: number[]): Promise<CommodityData> {
        let ret: CommodityData;

        const cacheKey = `${regionIds.join(',')}|${itemIds.join(',')}`;
        if (this.cache && this.cacheKey === cacheKey) {
            ret = this.cache;
        } else {
            const data = {
                regionIds,
                itemIds,
            };

            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(AuctionsCommoditiesSpecificStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                this.cache = ret = (await response.json()) as CommodityData;
                this.cacheKey = cacheKey;
            }
        }

        return ret;
    }
}
export const auctionsCommoditiesSpecificStore = new AuctionsCommoditiesSpecificStore();
