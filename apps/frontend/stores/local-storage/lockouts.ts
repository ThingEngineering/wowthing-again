import { writable } from 'svelte/store';

export class LockoutState {
    public sortBy: number;
}

const key = 'state-lockouts';
const initialState = new LockoutState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const lockoutState = writable<LockoutState>(initialState);

lockoutState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
