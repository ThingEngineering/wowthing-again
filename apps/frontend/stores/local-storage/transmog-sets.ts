import { writable } from 'svelte/store';

class TransmogSetsState {
    public collapsedCategories: Record<string, boolean> = {};
}

const key = 'state-transmog-sets';
const initialState = new TransmogSetsState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const transmogSetsState = writable<TransmogSetsState>(initialState);

transmogSetsState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
