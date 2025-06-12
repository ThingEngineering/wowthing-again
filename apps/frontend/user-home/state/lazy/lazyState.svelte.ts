import { doAchievements } from './achievements.svelte';
import { doConvertible } from './convertible.svelte';
import { doCustomizations } from './customizations.svelte';
import { doJournal } from './journal.svelte';
import { doTransmog } from './transmog.svelte';
import { doVendors } from './vendors.svelte';

class LazyState {
    public achievements = $derived.by(() => doAchievements());
    public convertible = $derived.by(() => doConvertible());
    public customizations = $derived.by(() => doCustomizations());
    public journal = $derived.by(() => doJournal());
    public transmog = $derived.by(() => doTransmog());
    public vendors = $derived.by(() => doVendors());
}

export const lazyState = new LazyState();
