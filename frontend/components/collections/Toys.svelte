<script lang="ts">
    import find from 'lodash/find'

    import { staticStore, userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams, StaticDataSetCategory } from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let sets: StaticDataSetCategory[][]
    let thingMap: Record<number, number>
    $: {
        thingMap = {}
        for (const toyId in $userStore.data.toys) {
            thingMap[toyId] = parseInt(toyId)
        }

        sets = getFilteredSets(
            $collectionState,
            'toys',
            $staticStore.data.toySets,
            (thing: number[]) => find(
                thing,
                (value) => $userStore.data.toys[value] === true
            )
        )
    }
</script>

<Collection
    route="toys"
    thingType="item"
    userHas={$userStore.data.toys}
    {params}
    {sets}
    {thingMap}
/>
