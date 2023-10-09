import { writable } from 'svelte/store'

import type { Region } from '@/enums/region'


export class AuctionsAppState {
    public region: Region
}

const key = 'state-auctions-app'
const initialState = new AuctionsAppState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const auctionsAppState = writable<AuctionsAppState>(initialState)

auctionsAppState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
