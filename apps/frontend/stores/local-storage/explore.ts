import { writable } from 'svelte/store';

export class ExploreState {
    public achievementId = 0;
    public questId = 0;
    public transmogSetId = 0;
}

const key = 'state-explore';
const initialState = new ExploreState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const exploreState = writable<ExploreState>(initialState);

exploreState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
