<script lang="ts">
    import { afterUpdate, setContext } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
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
        const context: CollectibleContext = {
            route,
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
    .collections {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div class="collections">
    <CollectibleSidebar
        {sets}
    />
    <CollectibleSection
        slug1={params.slug1}
        slug2={params.slug2}
        {sets}
    />
</div>
