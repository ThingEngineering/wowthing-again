import { logErrors } from '@/utils/log-errors';

import { doAchievements } from './achievements.svelte';
import { doAppearances } from './appearances.svelte';
import { doConvertible } from './convertible.svelte';
import { doCustomizations } from './customizations.svelte';
import { doJournal } from './journal.svelte';
import { doTransmog } from './transmog.svelte';
import { doVendors } from './vendors.svelte';
import { doZoneMaps } from './zoneMaps.svelte';

class LazyState {
    public achievements = $derived.by(() => logErrors(doAchievements));
    public appearances = $derived.by(() => logErrors(doAppearances));
    public convertible = $derived.by(() => logErrors(doConvertible));
    public customizations = $derived.by(() => logErrors(doCustomizations));
    public journal = $derived.by(() => logErrors(doJournal));
    public transmog = $derived.by(() => logErrors(doTransmog));
    public vendors = $derived.by(() => logErrors(doVendors));
    public zoneMaps = $derived.by(() => logErrors(doZoneMaps));
}

export const lazyState = new LazyState();
