import { writable } from 'svelte/store'


class CommoditiesState {
    public expanded: Record<string, boolean> = {}
}

const key = 'state-auctions-commodities'
const initialState = new CommoditiesState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const commoditiesState = writable<CommoditiesState>(initialState)

commoditiesState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
