import { writable } from 'svelte/store'


export class HistoryState {
    public chartType = 'stacked-area'
    public interval = 'hour'
    public timeFrame: 'all' | '1month' | '3month' | '6month' = 'all'
    public scaleType: 'category' | 'linear' | 'logarithmic' | 'time' | 'timeseries' = 'logarithmic'
}

const key = 'state-history'
const initialState = new HistoryState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const historyState = writable<HistoryState>(initialState)

historyState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
