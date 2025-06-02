import { writable } from 'svelte/store';

export class IllusionState {
    public highlightMissing = true;
    public showCollected = true;
    public showUncollected = true;
}

const key = 'state-illusion';
const initialState = new IllusionState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const illusionState = writable<IllusionState>(initialState);

illusionState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
