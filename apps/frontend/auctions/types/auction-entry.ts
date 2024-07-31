export class AuctionEntry {
    constructor(
        public groupKey: string,
        public totalQuantity: number,
        public lowestBuyoutPrice: number
    )
    { }
}
export type AuctionEntryArray = ConstructorParameters<typeof AuctionEntry>
