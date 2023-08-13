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

    public showCloaks = true
    public showTrash = true
    public showWeapons = true

    public showDungeonNormal = true
    public showDungeonHeroic = true
    public showDungeonMythic = true
    public showDungeonTimewalking = true

    public showRaidLfr = true
    public showRaidNormal = true
    public showRaidHeroic = true
    public showRaidMythic = true
    public showRaidMythicOld = true
    public showRaidTimewalking = true
    public showRaid10 = true
    public showRaid25 = true
}

const key = 'state-journal'
const initialState = new JournalState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const journalState = writable<JournalState>(initialState)

journalState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
