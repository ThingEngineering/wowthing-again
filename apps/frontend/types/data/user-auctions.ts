import type { ItemLocation, ItemQuality } from '@/enums'


export interface UserAuctionData {
    auctions: Record<number, UserAuctionDataAuction[]>
    names: Record<number, string>

    pets?: Record<number, UserAuctionDataPet[]>
}

export interface UserAuctionDataAuction {
    bidPrice: number
    buyoutPrice: number
    connectedRealmId: number
    itemId: number
    petBreedId: number
    petLevel: number
    petQuality: number
    timeLeft: number
}

export interface UserAuctionDataPet {
    breedId: number
    level: number
    location: ItemLocation
    locationId: number
    quality: ItemQuality
}
