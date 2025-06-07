import { writable } from 'svelte/store';

export class ZoneMapState {
    public showCompleted = true;
    public showKilled = true;

    public trackAchievements = true;
    public trackMounts = true;
    public trackPets = true;
    public trackQuests = false;
    public trackToys = true;
    public trackTransmog = true;
    public trackVendors = true;

    public classExpanded: Record<string, boolean> = {};
    public classFilters: Record<string, Record<number, boolean>> = {};
    public lootExpanded: Record<string, boolean> = {};
    public maxLevelOnly = false;
}

const key = 'state-zone-map';
const initialState = new ZoneMapState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const zoneMapState = writable<ZoneMapState>(initialState);

zoneMapState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
