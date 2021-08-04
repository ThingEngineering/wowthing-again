<script lang="ts">
    import { data as staticData } from '@/stores/static'
    import { userStore } from '@/stores'
    import type { Dictionary } from '@/types'

    import Collection from './Collection.svelte'

    export let params: { slug: string }

    const thingMap: Dictionary<number> = {}
    for (const toyId in $userStore.data.toys) {
        thingMap[toyId] = parseInt(toyId)
    }
</script>

<Collection
    route="toys"
    slug={params.slug}
    thingType="item"
    {thingMap}
    userHas={$userStore.data.toys}
    sets={$staticData.toySets}
/>
