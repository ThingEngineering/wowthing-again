import { writable } from 'svelte/store'


export class CollectingSettingsState {
    public expanded = false
}

const key = 'state-collecting-settings'
const initialState = new CollectingSettingsState()

const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as CollectingSettingsState
Object.assign(initialState, stored || {})

export const collectingSettingsState = writable<CollectingSettingsState>(initialState)

collectingSettingsState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
