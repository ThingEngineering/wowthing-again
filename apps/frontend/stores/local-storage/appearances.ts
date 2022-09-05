import { writable } from 'svelte/store'


export class AppearancesState {
    public highlightMissing = true
    public showCollected = true
    public showUncollected = true
}

const key = 'state-appearances'
const initialState = new AppearancesState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const appearanceState = writable<AppearancesState>(initialState)

appearanceState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
