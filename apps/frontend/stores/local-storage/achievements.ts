import { writable } from 'svelte/store';

export class AchievementsState {
    public showCompleted = true;
    public showIncomplete = true;

    public showAlliance = true;
    public showHorde = true;

    public showAllCharacters = false;
}

const key = 'state-achievements';
const initialState = new AchievementsState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const achievementState = writable<AchievementsState>(initialState);

achievementState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
