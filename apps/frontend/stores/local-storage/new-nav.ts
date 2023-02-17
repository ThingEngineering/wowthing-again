import { writable } from 'svelte/store'


export class NewNavState {
    public characterFilter: string
}

const key = 'state-new-nav'
const initialState = new NewNavState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const newNavState = writable<NewNavState>(initialState)

newNavState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
