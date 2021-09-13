<script lang="ts">
    import { afterUpdate, setContext } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { Dictionary, MultiSlugParams, StaticDataSetCategory } from '@/types'
    import type {CollectionContext} from '@/types/contexts'

    import CollectionSection from './CollectionSection.svelte'
    import CollectionSidebar from './CollectionSidebar.svelte'

    export let params: MultiSlugParams
    export let route: string
    export let thingType: string
    export let thingMap: Dictionary<number> = {}
    export let userHas: Dictionary<boolean> = {}
    export let sets: StaticDataSetCategory[][]

    const context: CollectionContext = {
        route,
        thingType,
        thingMap,
        userHas,
        sets,
    }
    setContext('collection', context)

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
    .sections {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>

<div class="collections">
    <CollectionSidebar />
    <div class="sections">
        <CollectionSection slug1={params.slug1} slug2={params.slug2} />
    </div>
</div>
