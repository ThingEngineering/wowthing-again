<script lang="ts">
    import some from 'lodash/some'

    import { staticStore, userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams, StaticDataSetCategory } from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let sets: StaticDataSetCategory[][]
    $: {
        sets = getFilteredSets(
            $collectionState,
            'pets',
            $staticStore.data.petSets,
            (thing: number[]) => some(
                thing,
                (value) => $userStore.data.petsHas[$staticStore.data.creatureToPet[value] || -1] === true
            )
        )
    }
</script>

<Collection
    route="pets"
    thingType="npc"
    thingMap={$staticStore.data.creatureToPet}
    userHas={$userStore.data.petsHas}
    {params}
    {sets}
/>
