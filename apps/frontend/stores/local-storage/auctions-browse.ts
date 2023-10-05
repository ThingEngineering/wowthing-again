import { writable } from 'svelte/store'


export class AuctionsBrowseState {
    public filter: string = null
    public browseSelected: Record<number, string> = {}
}

const key = 'state-auctions-browse'
const initialState = new AuctionsBrowseState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const auctionsBrowseState = writable<AuctionsBrowseState>(initialState)

auctionsBrowseState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
