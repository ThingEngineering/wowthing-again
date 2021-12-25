<script lang="ts">
    import some from 'lodash/some'

    import { userStore}  from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import { staticStore } from '@/stores/static'
    import { getFilteredSets } from '@/utils/collections'
    import type { MultiSlugParams, StaticDataSetCategory } from '@/types'

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
                (value) => $userStore.data.mounts[$staticStore.data.spellToMount[value] || -1] === true
            )
        )
    }
</script>

<Collection
    route="mounts"
    thingType="spell"
    thingMap={$staticStore.data.spellToMount}
    userHas={$userStore.data.mounts}
    {params}
    {sets}
/>
