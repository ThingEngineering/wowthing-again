import { writable } from 'svelte/store';

export class HeirloomState {
    public highlightMissing = true;
    public showCollected = true;
    public showUncollected = true;
}

const key = 'state-heirloom';
const initialState = new HeirloomState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const heirloomState = writable<HeirloomState>(initialState);

heirloomState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
