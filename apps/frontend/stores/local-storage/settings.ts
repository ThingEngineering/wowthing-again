import { writable } from 'svelte/store'


export class SettingsState {
    public selectedGroup: string
    public selectedView: string
}

const key = 'state-settings'
const initialState = new SettingsState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const settingsState = writable<SettingsState>(initialState)

settingsState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
