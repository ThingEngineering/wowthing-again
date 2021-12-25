<script lang="ts">
    import { afterUpdate, setContext } from 'svelte'

    import type { MultiSlugParams, StaticDataSetCategory } from '@/types'
    import type { CollectionContext } from '@/types/contexts'
    import getSavedRoute from '@/utils/get-saved-route'

    import CollectionSection from './CollectionSection.svelte'
    import CollectionSidebar from './CollectionSidebar.svelte'

    export let params: MultiSlugParams
    export let route: string
    export let thingType: string
    export let thingMap: Record<number, number> = {}
    export let userHas: Record<number, boolean> = {}
    export let sets: StaticDataSetCategory[][]

    $: {
        const context: CollectionContext = {
            route,
            thingType,
            thingMap,
            userHas,
        }
        setContext('collection', context)
    }

    afterUpdate(() => {
        window.__tip?.watchElligibleElements()

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
    <CollectionSidebar
        {sets}
    />
    <CollectionSection
        slug1={params.slug1}
        slug2={params.slug2}
        {sets}
    />
</div>
