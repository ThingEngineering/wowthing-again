<script lang="ts">
    import { afterUpdate, onMount, setContext } from 'svelte'

    import type { Dictionary, MultiSlugParams, StaticDataSetCategory } from '@/types'
    import type {CollectionContext} from '@/types/contexts'
    import {userCollectionStore} from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

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

    onMount(async () => await userCollectionStore.fetch())

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

{#if !$userCollectionStore.loaded}
    L O A D I N G
{:else}
    <div class="collections">
        <CollectionSidebar />
        <div class="sections">
            <CollectionSection slug1={params.slug1} slug2={params.slug2} />
        </div>
    </div>
{/if}
