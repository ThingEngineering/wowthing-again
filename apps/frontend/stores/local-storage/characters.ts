import { writable } from 'svelte/store';

export class CharactersState {
    public lastTab: string;

    public professionsShowAlreadyCrafted = true;
    public professionsShowLearned = true;
    public professionsShowUnlearned = true;
}

const key = 'state-characters';
const initialState = new CharactersState();

const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as CharactersState;
Object.assign(initialState, stored || {});

export const charactersState = writable<CharactersState>(initialState);

charactersState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
