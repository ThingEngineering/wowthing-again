import type { AuctionCategory, AuctionCategoryArray } from './category'


export interface AuctionData {
    categories: AuctionCategory[]
    categoryMap: Record<number, AuctionCategory>
    rawCategories: AuctionCategoryArray[]
}
