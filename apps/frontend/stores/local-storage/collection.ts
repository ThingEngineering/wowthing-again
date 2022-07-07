import { writable } from 'svelte/store'


export class CollectionState {
    public highlightMissing: Record<string, boolean> = {
        mounts: true,
        pets: true,
        toys: true,
    }
    public showCollected: Record<string, boolean> = {
        mounts: true,
        pets: true,
        toys: true,
    }
    public showUncollected: Record<string, boolean> = {
        mounts: true,
        pets: true,
        toys: true,
    }
}

const key = 'state-collections'
const initialState = new CollectionState()

const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as CollectionState
Object.assign(initialState.highlightMissing, stored.highlightMissing || {})
Object.assign(initialState.showCollected, stored.showCollected || {})
Object.assign(initialState.showUncollected, stored.showUncollected || {})

export const collectionState = writable<CollectionState>(initialState)

collectionState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
