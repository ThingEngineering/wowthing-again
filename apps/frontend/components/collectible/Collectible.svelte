<script lang="ts">
    import { afterUpdate, setContext } from 'svelte';

    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';
    import type { CollectibleContext } from '@/types/contexts';
    import type { ManualDataSetCategory } from '@/types/data/manual';

    import CollectibleSection from './CollectibleSection.svelte';
    import CollectibleSidebar from './CollectibleSidebar.svelte';
    import PetSearch from './PetSearch.svelte';

    export let params: MultiSlugParams;
    export let route: string;
    export let sets: ManualDataSetCategory[][];
    export let stats: CollectibleContext['stats'];
    export let thingMapFunc: (thing: number) => number = undefined;
    export let thingType: string;
    export let userHas: Set<number>;

    $: {
        const countsKey = route.split('/').slice(-1)[0];
        const context: CollectibleContext = {
            countsKey,
            route,
            stats,
            thingMapFunc,
            thingType,
            userHas,
        };
        setContext('collection', context);
    }

    afterUpdate(() => {
        getSavedRoute(route, params.slug1, params.slug2);
    });
</script>

<style lang="scss">
    .view {
        overflow-x: hidden;
    }
</style>

<div class="view">
    <CollectibleSidebar includeSearch={true} {sets} />

    {#if params.slug1 === 'search'}
        <PetSearch />
    {:else}
        <CollectibleSection slug1={params.slug1} slug2={params.slug2} {sets}>
            <slot name="extra-options" slot="extra-options" />
        </CollectibleSection>
    {/if}
</div>
