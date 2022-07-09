<script lang="ts">
    import some from 'lodash/some'

    import { userStore}  from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import { staticStore } from '@/stores/static'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams } from '@/types'
    import type { StaticDataSetCategory } from '@/types/data/static'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let sets: StaticDataSetCategory[][]
    $: {
        sets = getFilteredSets(
            $collectionState,
            'mounts',
            $staticStore.data.mountSets,
            (thing: number[]) => some(
                thing,
                (value) => $userStore.data.hasMount[value] === true
            )
        )
        
    }
    
    const thingMapFunc = (thing: number) => $staticStore.data.mounts[thing].spellId
</script>

<Collection
    route="mounts"
    thingType="spell"
    userHas={$userStore.data.hasMount}
    {params}
    {sets}
    {thingMapFunc}
/>
