import { writable } from 'svelte/store';

export class ProgressState {
    public sortOrder: Record<string, string> = {};
}

const key = 'state-progress';
const initialState = new ProgressState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const progressState = writable<ProgressState>(initialState);

progressState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
