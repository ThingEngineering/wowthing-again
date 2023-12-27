import { writable } from 'svelte/store'


class RecipesState {
    public highlightMissing = true
    public showCollected = true
    public showUncollected = true
}

const key = 'state-recipes'
const initialState = new RecipesState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const recipesState = writable<RecipesState>(initialState)

recipesState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
