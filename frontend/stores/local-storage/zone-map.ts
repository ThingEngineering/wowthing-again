import { writable } from 'svelte/store'


export class ZoneMapState {
    public trackMounts = true
    public trackPets = true
    public trackQuests = true
    public trackToys = true
    public trackTransmog = true
}

const key = 'state-zone-map'
const initialState = new ZoneMapState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const zoneMapState = writable<ZoneMapState>(initialState)

zoneMapState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
