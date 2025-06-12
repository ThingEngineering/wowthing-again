import { doAchievements } from './achievements.svelte';
import { doAppearances } from './appearances.svelte';
import { doConvertible } from './convertible.svelte';
import { doCustomizations } from './customizations.svelte';
import { doJournal } from './journal.svelte';
import { doTransmog } from './transmog.svelte';
import { doVendors } from './vendors.svelte';
import { doZoneMaps } from './zoneMaps.svelte';

class LazyState {
    public achievements = $derived.by(() => doAchievements());
    public appearances = $derived.by(() => doAppearances());
    public convertible = $derived.by(() => doConvertible());
    public customizations = $derived.by(() => doCustomizations());
    public journal = $derived.by(() => doJournal());
    public transmog = $derived.by(() => doTransmog());
    public vendors = $derived.by(() => doVendors());
    public zoneMaps = $derived.by(() => doZoneMaps());
}

export const lazyState = new LazyState();
