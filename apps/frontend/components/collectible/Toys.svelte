<script lang="ts">
    import { getBasePathContext } from '@/shared/contexts/basePath';
    import { userState } from '@/user-home/state/user';
    import type { ParamsSlugsProps } from '@/types/props';

    import Collectible from './Collectible.svelte';

    let { params }: ParamsSlugsProps = $props();

    const basePath = getBasePathContext();
</script>

<Collectible
    route={basePath ? `${basePath}/toys` : 'toys'}
    sets={userState.toys.filteredCategories}
    stats={userState.toys.stats}
    thingType="item"
    userHas={userState.general.hasToyByItemId}
    {params}
/>
