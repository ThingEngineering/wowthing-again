import { writable } from 'svelte/store';

export class VendorState {
    public filtersExpanded = false;

    public highlightMissing = true;
    public showCollected = true;
    public showUncollected = true;

    public showCloth = true;
    public showLeather = true;
    public showMail = true;
    public showPlate = true;

    public showCloaks = true;
    public showCosmetics = true;
    public showWeapons = true;

    public showDragonriding = true;
    public showIllusions = true;
    public showMounts = true;
    public showPets = true;
    public showRecipes = true;
    public showToys = true;

    public showPvp = true;
    public showTier = true;

    public showAwakened = true;
}

const key = 'state-vendors';
const initialState = new VendorState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const vendorState = writable<VendorState>(initialState);

vendorState.subscribe((state) => {
    localStorage.setItem(key, JSON.stringify(state));
});
