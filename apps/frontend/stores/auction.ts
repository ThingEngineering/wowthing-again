import { WritableFancyStore } from '@/types/fancy-store';
import { AuctionCategory, type AuctionData } from '@/types/data/auction';

export class AuctionDataStore extends WritableFancyStore<AuctionData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-auction');
    }

    initialize(data: AuctionData) {
        console.time('AuctionDataStore.initialize');

        if (data.rawCategories) {
            data.categories = [];
            data.categoryMap = {};
            for (const categoryArray of data.rawCategories) {
                const obj = new AuctionCategory(...categoryArray);
                data.categories.push(obj);

                this.recurseChildren(data.categoryMap, obj);
            }
            data.rawCategories = null;
        }

        console.timeEnd('AuctionDataStore.initialize');
    }

    private recurseChildren(
        categoryMap: Record<number, AuctionCategory>,
        category: AuctionCategory,
    ) {
        categoryMap[category.id] = category;
        for (const childCategory of category.children || []) {
            this.recurseChildren(categoryMap, childCategory);
        }
    }
}

export const auctionStore = new AuctionDataStore();
