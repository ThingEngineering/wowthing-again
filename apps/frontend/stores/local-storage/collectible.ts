import { writable } from 'svelte/store';

export class CollectibleState {
    public highlightMissing: Record<string, boolean> = {
        customizations: true,
        mounts: true,
        pets: true,
        toys: true,
    };
    public showCollected: Record<string, boolean> = {
        customizations: true,
        mounts: true,
        pets: true,
        toys: true,
    };
    public showUncollected: Record<string, boolean> = {
        customizations: true,
        mounts: true,
        pets: true,
        toys: true,
    };

    public petSearchNoMaxLevel: boolean = true;
}

const key = 'state-collectible';
const initialState = new CollectibleState();

const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as CollectibleState;
Object.assign(initialState.highlightMissing, stored.highlightMissing || {});
Object.assign(initialState.showCollected, stored.showCollected || {});
Object.assign(initialState.showUncollected, stored.showUncollected || {});

export const collectibleState = writable<CollectibleState>(initialState);

collectibleState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
