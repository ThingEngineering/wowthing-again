<script lang="ts">
    import { staticStore, userCollectionStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let thingMap: Record<number, number>
    $: {
        thingMap = {}
        for (const toyId in $userCollectionStore.data.toys) {
            thingMap[toyId] = parseInt(toyId)
        }
    }
</script>

<Collection
    route="toys"
    {params}
    thingType="item"
    {thingMap}
    userHas={$userCollectionStore.data.toys}
    sets={$staticStore.data.toySets}
/>
