import { writable } from 'svelte/store'


class ProfessionsRecipesState {
    public includeTrainerRecipes = true
}

const key = 'state-professions-recipes'
const initialState = new ProfessionsRecipesState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const professionsRecipesState = writable<ProfessionsRecipesState>(initialState)

professionsRecipesState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
