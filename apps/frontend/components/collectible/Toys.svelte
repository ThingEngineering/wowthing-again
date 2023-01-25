<script lang="ts">
    import some from 'lodash/some'

    import { manualStore, settingsStore, userStore } from '@/stores'
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
            'toys',
            $manualStore.toySets,
            (thing: number[]) => some(
                thing,
                (toyId) => $userStore.hasToy[toyId] === true
            )
        )
    }
</script>

<Collectible
    route="toys"
    thingType="item"
    userHas={$userStore.hasToy}
    {params}
    {sets}
/>
