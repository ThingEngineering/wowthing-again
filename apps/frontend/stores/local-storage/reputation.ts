import { writable } from 'svelte/store';

export class ReputationState {
    public sortOrder: Record<string, number[]> = {};
}

const key = 'state-reputation';
const initialState = new ReputationState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const reputationState = writable<ReputationState>(initialState);

reputationState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
