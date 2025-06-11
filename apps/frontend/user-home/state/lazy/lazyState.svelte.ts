import { doCustomizations } from './customizations.svelte';
import { doTransmog } from './transmog.svelte';

class LazyState {
    public customizations = $derived.by(() => doCustomizations());
    public transmog = $derived.by(() => doTransmog());
}

export const lazyState = new LazyState();
