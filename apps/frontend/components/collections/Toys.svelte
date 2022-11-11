<script lang="ts">
    import some from 'lodash/some'

    import { manualStore, userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import { data as settings } from '@/stores/settings'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams } from '@/types'
    import type { ManualDataSetCategory } from '@/types/data/manual'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let sets: ManualDataSetCategory[][]
    $: {
        sets = getFilteredSets(
            $settings,
            $collectionState,
            'toys',
            $manualStore.data.toySets,
            (thing: number[]) => some(
                thing,
                (toyId) => $userStore.data.hasToy[toyId] === true
            )
        )
    }
</script>

<Collection
    route="toys"
    thingType="item"
    userHas={$userStore.data.hasToy}
    {params}
    {sets}
/>
