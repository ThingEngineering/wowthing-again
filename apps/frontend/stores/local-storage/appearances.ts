import { writable } from 'svelte/store';

export class AppearancesState {
    [key: string]: boolean;

    public highlightMissing = true;
    public showCollected = true;
    public showUncollected = true;

    public showQuality0 = true;
    public showQuality1 = true;
    public showQuality2 = true;
    public showQuality3 = true;
    public showQuality4 = true;
    public showQuality5 = true;
    public showQuality6 = true;
    public showQuality7 = true;
}

const key = 'state-appearances';
const initialState = new AppearancesState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const appearanceState = writable<AppearancesState>(initialState);

appearanceState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
