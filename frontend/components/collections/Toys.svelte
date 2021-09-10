<script lang="ts">
    import { staticStore } from '@/stores/static'
    import { userStore } from '@/stores'
    import type {Dictionary, MultiSlugParams} from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    const thingMap: Dictionary<number> = {}
    for (const toyId in $userStore.data.toys) {
        thingMap[toyId] = parseInt(toyId)
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
