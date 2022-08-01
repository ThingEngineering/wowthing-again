import { writable } from 'svelte/store'


export class VendorState {
    public highlightMissing = true
    
    public showCollected = true
    public showUncollected = true

    public showPvp = true
    public showTier = true
}

const key = 'state-vendors'
const initialState = new VendorState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const vendorState = writable<VendorState>(initialState)

vendorState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
