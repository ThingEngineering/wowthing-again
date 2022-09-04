import { writable } from 'svelte/store'


export type AuctionStatePerPage = 25 | 50 | 100
export type AuctionStateSortBy =
    | 'name_down'
    | 'name_up'
    | 'price_down'
    | 'price_up'

export class AuctionState {
    public perPage: AuctionStatePerPage = 50

    public region = '0'

    public sortBy: Record<string, AuctionStateSortBy> = {
        'extra-pets': 'price_down',
        'missing-mounts': 'name_up',
        'missing-pets': 'name_up',
        'missing-toys': 'name_up',
    }
}

const key = 'state-auctions'
const initialState = new AuctionState()

const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as AuctionState
if (stored.perPage) {
    initialState.perPage = stored.perPage
}
Object.assign(initialState, stored || {})

export const auctionState = writable<AuctionState>(initialState)

auctionState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
