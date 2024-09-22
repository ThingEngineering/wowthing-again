export type CommodityData = {
    regions: Record<number, Record<number, number>>;
};

export class AuctionsCommoditiesSpecificStore {
    private static url = '/api/auctions/commodities-specific';

    async search(regionIds: number[], itemIds: number[]): Promise<CommodityData> {
        let ret: CommodityData;

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
            ret = (await response.json()) as CommodityData;
        }

        return ret;
    }
}
export const auctionsCommoditiesSpecificStore = new AuctionsCommoditiesSpecificStore();
