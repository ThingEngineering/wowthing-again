import { writable } from 'svelte/store';

export class SubSidebarState {
    public expanded: Record<string, boolean> = {};
}

const key = 'state-sub-sidebar';
const initialState = new SubSidebarState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const subSidebarState = writable<SubSidebarState>(initialState);

subSidebarState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
