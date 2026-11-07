<script lang="ts">
    import { getBasePathContext } from '@/shared/contexts/basePath';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { ParamsSlugsProps } from '@/types/props';

    import Collectible from './Collectible.svelte';

    let { params }: ParamsSlugsProps = $props();

    const basePath = getBasePathContext();

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
