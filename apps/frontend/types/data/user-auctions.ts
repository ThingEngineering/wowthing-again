import type { ItemLocation, ItemQuality } from '@/enums'


export interface UserAuctionData {
    names: Record<number, string>

    pets?: Record<number, UserAuctionDataPet[]>

    auctions: Record<number, UserAuctionDataAuction[]>
    rawAuctions: Record<number, UserAuctionDataAuctionArray[]>
}

export class UserAuctionDataAuction {
    constructor(
        public connectedRealmId: number,
        public context: number,
        public quantity: number,
        public timeLeft: number,
        public itemId: number,
        public petSpeciesId: number,
        public petBreedId: number,
        public petLevel: number,
        public petQuality: number,
        public bidPrice: number,
        public buyoutPrice: number,
        public bonusIds: number[],
        public modifierTypes: number[],
        public modifierValues: number[]
    )
    { }
}

export type UserAuctionDataAuctionArray = ConstructorParameters<typeof UserAuctionDataAuction>

export interface UserAuctionDataPet {
    breedId: number
    level: number
    location: ItemLocation
    locationId: number
    quality: ItemQuality
}
