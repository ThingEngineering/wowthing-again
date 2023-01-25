<script lang="ts">
    import some from 'lodash/some'

    import { manualStore, settingsStore, staticStore, userStore}  from '@/stores'
    import { collectibleState } from '@/stores/local-storage'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams } from '@/types'
    import type { ManualDataSetCategory } from '@/types/data/manual'

    import Collectible from './Collectible.svelte'

    export let params: MultiSlugParams

    let sets: ManualDataSetCategory[][]
    $: {
        sets = getFilteredSets(
            $settingsStore,
            $collectibleState,
            'mounts',
            $manualStore.mountSets,
            (thing: number[]) => some(
                thing,
                (value) => $userStore.hasMount[value] === true
            )
        )
        
    }
    
    const thingMapFunc = (thing: number) => $staticStore.mounts[thing].spellId
</script>

<Collectible
    route="mounts"
    thingType="spell"
    userHas={$userStore.hasMount}
    {params}
    {sets}
    {thingMapFunc}
/>
