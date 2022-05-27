import { writable } from 'svelte/store'


export class JournalState {
    public filtersExpanded = true
    public highlightMissing = true
    public showCollected = true
    public showUncollected = true
    public showCloth = true
    public showLeather = true
    public showMail = true
    public showPlate = true
    public showTrash = true
    public showWeapons = true

    public showLfr = true
    public showNormal = true
    public showHeroic = true
    public showMythic = true
    public showTimewalking = true
}

const key = 'state-journal'
const initialState = new JournalState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const journalState = writable<JournalState>(initialState)

journalState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
