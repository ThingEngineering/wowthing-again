<script lang="ts">
    import some from 'lodash/some'

    import { manualStore, settingsStore, staticStore, userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams } from '@/types'
    import type { ManualDataSetCategory } from '@/types/data/manual'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let sets: ManualDataSetCategory[][]
    $: {
        sets = getFilteredSets(
            $settingsStore,
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
