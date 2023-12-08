export type CommodityData = {
    regions: Record<number, Record<number, number>>
}

export class CommodityAuctionsStore {
    private static url = '/api/auctions/commodities'
    private cache: CommodityData = null

    async fetch(
        // auctionState: AuctionState
    ): Promise<CommodityData> {
        let ret: CommodityData
        
        if (this.cache !== null) {
            ret = this.cache
        }
        else {
            const xsrf = document.getElementById('app')
                .getAttribute('data-xsrf')

            const response = await fetch(CommodityAuctionsStore.url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': xsrf,
                },
            })

            if (response.ok) {
                this.cache = ret = await response.json() as CommodityData
            }
        }

        return ret
    }
}
export const commodityAuctionsStore = new CommodityAuctionsStore()
