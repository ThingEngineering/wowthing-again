<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { lazyStore, userStore } from '@/stores';
    import type { MultiSlugParams } from '@/types';

    import Collectible from './Collectible.svelte';

    export let basePath = '';
    export let params: MultiSlugParams;

    const thingMapFunc = (thing: number) => wowthingData.static.mountById.get(thing)?.spellId;
</script>

<Collectible
    route={basePath ? `${basePath}/mounts` : 'mounts'}
    sets={$lazyStore.mounts.filteredCategories}
    thingType="spell"
    userHas={$userStore.hasMount}
    {params}
    {thingMapFunc}
/>
