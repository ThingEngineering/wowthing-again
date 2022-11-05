import { writable } from 'svelte/store'


export class GearState {
    highlightEnchants = false
    highlightGems = false
    highlightHeirlooms = false
    highlightUpgrades = false

    showMaxLevel = true
    showOtherLevel = true

    get highlightAny(): boolean {
        return this.highlightEnchants || this.highlightGems || this.highlightUpgrades
    }
}

const key = 'state-gear'
const initialState = new GearState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const gearState = writable<GearState>(initialState)

gearState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
