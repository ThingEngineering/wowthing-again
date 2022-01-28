<script lang="ts">
    import some from 'lodash/some'

    import { staticStore, userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams } from '@/types'
    import type { StaticDataSetCategory } from '@/types/data/static'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let sets: StaticDataSetCategory[][]
    $: {
        sets = getFilteredSets(
            $collectionState,
            'toys',
            $staticStore.data.toySets,
            (thing: number[]) => some(
                thing,
                (value) => $userStore.data.hasToy[value] === true
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
