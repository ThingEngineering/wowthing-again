<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { MultiSlugParams } from '@/types';

    import Collectible from './Collectible.svelte';

    let { basePath = '', params }: { basePath: string; params: MultiSlugParams } = $props();

    const thingMapFunc = (thing: number) => wowthingData.static.mountById.get(thing)?.spellId;
</script>

<Collectible
    route={basePath ? `${basePath}/mounts` : 'mounts'}
    sets={userState.mounts.filteredCategories}
    stats={userState.mounts.stats}
    thingType="spell"
    userHas={userState.general.hasMountById}
    {params}
    {thingMapFunc}
/>
