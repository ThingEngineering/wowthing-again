export interface UserAuctionData {
    auctions: Record<number, UserAuctionDataAuction[]>
    names: Record<number, string>
}

export interface UserAuctionDataAuction {
    bidPrice: number
    buyoutPrice: number
    connectedRealmId: number
    itemId: number
    timeLeft: number
}
