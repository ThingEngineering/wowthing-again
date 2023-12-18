import { writable } from 'svelte/store'


export class HomeState {
    public groupSort: Record<number, string> = {}
}

const key = 'state-home'
const initialState = new HomeState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const homeState = writable<HomeState>(initialState)

homeState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
