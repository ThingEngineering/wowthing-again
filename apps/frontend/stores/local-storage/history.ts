import { writable } from 'svelte/store';

export class HistoryState {
    public chartType: 'area-stacked' | 'line' = 'line';
    public interval: 'hour' | 'day' | 'week' | 'month' = 'hour';
    public scaleType: 'category' | 'linear' | 'logarithmic' | 'time' | 'timeseries' = 'logarithmic';
    public timeFrame: 'all' | '1week' | '1month' | '3month' | '6month' | '1year' = 'all';
    public tooltipCombineSmall = false;
    public totalOnly = false;
}

const key = 'state-history';
const initialState = new HistoryState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const historyState = writable<HistoryState>(initialState);

historyState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
