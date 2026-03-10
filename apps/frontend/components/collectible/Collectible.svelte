<script lang="ts">
    import { setContext } from 'svelte';

    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';
    import type { CollectibleContext } from '@/types/contexts';
    import type { ManualDataSetCategory } from '@/types/data/manual';

    import CollectibleSection from './CollectibleSection.svelte';
    import CollectibleSidebar from './CollectibleSidebar.svelte';
    import PetSearch from './PetSearch.svelte';

    type Props = {
        params: MultiSlugParams;
        route: string;
        sets: ManualDataSetCategory[][];
        stats: CollectibleContext['stats'];
        thingType: string;
        userHas: Set<number>;
        thingMapFunc?: (thing: number) => number;
        thingQualityFunc?: (thing: number) => number;
    };
    let { params, route, sets, stats, thingType, userHas, thingMapFunc, thingQualityFunc }: Props =
        $props();

    let context: CollectibleContext = $derived({
        countsKey: route.split('/').slice(-1)[0],
        route,
        stats,
        thingType,
        userHas,
        thingMapFunc,
        thingQualityFunc,
    });
    setContext('collectible', () => context);

    $effect(() => getSavedRoute(route, params.slug1, params.slug2));
</script>

<style lang="scss">
    .view {
        overflow-x: hidden;
    }
</style>

<div class="view">
    <CollectibleSidebar includeSearch={route === 'pets'} {sets} />

    {#if params.slug1 === 'search'}
        <PetSearch />
    {:else}
        <CollectibleSection slug1={params.slug1} slug2={params.slug2} {sets}>
            <slot name="extra-options" slot="extra-options" />
        </CollectibleSection>
    {/if}
</div>
