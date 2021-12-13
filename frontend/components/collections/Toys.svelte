<script lang="ts">
    import { staticStore, userStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let thingMap: Record<number, number>
    $: {
        thingMap = {}
        for (const toyId in $userStore.data.toys) {
            thingMap[toyId] = parseInt(toyId)
        }
    }
</script>

<Collection
    route="toys"
    {params}
    thingType="item"
    {thingMap}
    userHas={$userStore.data.toys}
    sets={$staticStore.data.toySets}
/>
