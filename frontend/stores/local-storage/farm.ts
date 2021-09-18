import { writable } from 'svelte/store'


export class FarmState {
    public trackMounts = true
    public trackPets = true
    public trackQuests = true
    public trackToys = true
    public trackTransmog = true
}


const initialState = new FarmState()
Object.assign(initialState, JSON.parse(localStorage.getItem('state-farm') ?? '{}'))

export const farmState = writable<FarmState>(initialState)

farmState.subscribe(state => {
    localStorage.setItem('state-farm', JSON.stringify(state))
})
