import type { AuctionCategory, AuctionCategoryArray } from './category'


export interface AuctionData {
    categories: AuctionCategory[]
    rawCategories: AuctionCategoryArray[]
}
