<script lang="ts">
    import { userState } from '@/user-home/state/user';
    import type { MultiSlugParams } from '@/types';

    import Collectible from './Collectible.svelte';

    export let basePath = '';
    export let params: MultiSlugParams;
</script>

<Collectible
    route={basePath ? `${basePath}/toys` : 'toys'}
    sets={userState.toys.filteredCategories}
    stats={userState.toys.stats}
    thingType="item"
    userHas={userState.general.hasToyByItemId}
    {params}
/>
