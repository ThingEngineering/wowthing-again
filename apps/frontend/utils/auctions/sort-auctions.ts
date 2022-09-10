import sortBy from 'lodash/sortBy'


interface SortableAuction {
    name: string
    auctions: {
        bidPrice: number
        buyoutPrice: number
    }[]
}

export function sortAuctions<T extends SortableAuction>(
    sortType: string,
    auctions: T[]
): T[] {
    if (sortType === 'name_down') {
        auctions = sortBy(auctions, (item) => item.name)
        auctions.reverse()
    }
    else if (sortType === 'price_up') {
        auctions = sortBy(auctions, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
    }
    else if (sortType === 'price_down') {
        auctions = sortBy(auctions, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
        auctions.reverse()
    }
    // name_up is default
    else {
        auctions = sortBy(auctions, (item) => item.name)
    }

    return auctions
}
