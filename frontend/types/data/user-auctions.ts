export interface UserAuctionData {
    itemNames: Record<number, string>
    petNames: Record<number, string>
    missingPets: Record<number, UserAuctionDataAuction[]>
    missingToys: Record<number, UserAuctionDataAuction[]>
}

export interface UserAuctionDataAuction {
    bidPrice: number
    buyoutPrice: number
    connectedRealmId: number
    itemId: number
    timeLeft: number
}
