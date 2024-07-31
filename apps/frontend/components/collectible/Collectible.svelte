<script lang="ts">
    import { afterUpdate, setContext } from 'svelte'

    import { lazyStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { LazyCollectible } from '@/stores/lazy/collectible'
    import type { MultiSlugParams } from '@/types'
    import type { CollectibleContext } from '@/types/contexts'
    import type { ManualDataSetCategory} from '@/types/data/manual'

    import CollectibleSection from './CollectibleSection.svelte'
    import CollectibleSidebar from './CollectibleSidebar.svelte'

    export let params: MultiSlugParams
    export let route: string
    export let sets: ManualDataSetCategory[][]
    export let thingMapFunc: (thing: number) => number = undefined
    export let thingType: string
    export let userHas: Record<number, boolean> = {}

    $: {
        const countsKey = route.split('/').slice(-1)[0]
        const context: CollectibleContext = {
            countsKey,
            route,
            stats: ($lazyStore.lookup(countsKey) as LazyCollectible).stats,
            thingMapFunc,
            thingType,
            userHas,
        }
        setContext('collection', context)
    }

    afterUpdate(() => {
        getSavedRoute(route, params.slug1, params.slug2)
    })
</script>

<style lang="scss">
    .view {
        overflow-x: hidden;
    }
</style>

<div class="view">
    <CollectibleSidebar
        {sets}
    />
    <CollectibleSection
        slug1={params.slug1}
        slug2={params.slug2}
        {sets}
    >
        <slot name="extra-options" slot="extra-options" />
    </CollectibleSection>
</div>
