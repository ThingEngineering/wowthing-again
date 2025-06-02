import { writable } from 'svelte/store';

export class CurrencyState {
    public sortOrder: Record<string, number> = {};
}

const key = 'state-currency';
const initialState = new CurrencyState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const currencyState = writable<CurrencyState>(initialState);

currencyState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
