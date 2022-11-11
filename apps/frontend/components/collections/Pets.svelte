<script lang="ts">
    import some from 'lodash/some'

    import { manualStore, staticStore, userStore } from '@/stores'
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
            'pets',
            $manualStore.data.petSets,
            (thing: number[]) => some(
                thing,
                (petId) => $userStore.data.hasPet[petId] === true
            )
        )
    }
    
    const thingMapFunc = (thing: number) => $staticStore.data.pets[thing].creatureId
</script>

<Collection
    route="pets"
    thingType="npc"
    userHas={$userStore.data.hasPet}
    {params}
    {sets}
    {thingMapFunc}
/>
