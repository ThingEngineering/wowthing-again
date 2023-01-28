<script lang="ts">
    import some from 'lodash/some'

    import { manualStore, settingsStore, staticStore, userStore } from '@/stores'
    import { collectibleState } from '@/stores/local-storage'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams } from '@/types'
    import type { ManualDataSetCategory } from '@/types/data/manual'

    import Collectible from './Collectible.svelte'

    export let basePath = ''
    export let params: MultiSlugParams

    let sets: ManualDataSetCategory[][]
    $: {
        sets = getFilteredSets(
            $settingsStore,
            $collectibleState,
            'pets',
            $manualStore.petSets,
            (thing: number[]) => some(
                thing,
                (petId) => $userStore.hasPet[petId] === true
            )
        )
    }
    
    const thingMapFunc = (thing: number) => $staticStore.pets[thing].creatureId
</script>

<Collectible
    route={basePath ? `${basePath}/pets` : 'pets'}
    thingType="npc"
    userHas={$userStore.hasPet}
    {params}
    {sets}
    {thingMapFunc}
/>
