import { writable } from 'svelte/store';

export class GearState {
    highlightBagSize = false;
    highlightEnchants = false;
    highlightGems = false;
    highlightHeirlooms = false;
    highlightItemLevel = false;
    highlightUpgrades = false;

    minimumBagSize = 0;
    minimumItemLevel = 0;

    get highlightAny(): boolean {
        return (
            this.highlightEnchants ||
            this.highlightGems ||
            this.highlightHeirlooms ||
            this.highlightItemLevel ||
            this.highlightUpgrades
        );
    }
}

const key = 'state-gear';
const initialState = new GearState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const gearState = writable<GearState>(initialState);

gearState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
