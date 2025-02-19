import sortBy from 'lodash/sortBy';

export interface SortableAuction {
    id: number | string;
    name: string;
    auctions: {
        bidPrice: number;
        buyoutPrice: number;
    }[];
}

export function sortAuctions<T extends SortableAuction>(
    sortType: string,
    auctions: T[],
    ignoreBid = false,
): T[] {
    if (sortType === 'name_down') {
        auctions = sortBy(auctions, (item) => item.name);
        auctions.reverse();
    } else if (sortType?.startsWith('price_')) {
        auctions = sortBy(auctions, (item) =>
            ignoreBid
                ? item.auctions[0].buyoutPrice
                : item.auctions[0].bidPrice || item.auctions[0].buyoutPrice,
        );
        if (sortType === 'price_down') {
            auctions.reverse();
        }
    }
    // name_up is default
    else {
        auctions = sortBy(auctions, (item) => item.name);
    }

    return auctions;
}
