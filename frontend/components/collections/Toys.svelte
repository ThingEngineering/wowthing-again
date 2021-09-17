<script lang="ts">
    import { onMount } from 'svelte'

    import { staticStore, userCollectionStore } from '@/stores'
    import type {Dictionary, MultiSlugParams} from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    let thingMap: Dictionary<number>
    $: {
        if ($userCollectionStore.loaded) {
            thingMap = {}
            for (const toyId in $userCollectionStore.data.toys) {
                thingMap[toyId] = parseInt(toyId)
            }
        }
    }

    onMount(async () => await userCollectionStore.fetch())
</script>

{#if $userCollectionStore.loaded}
    <Collection
        route="toys"
        {params}
        thingType="item"
        {thingMap}
        userHas={$userCollectionStore.data.toys}
        sets={$staticStore.data.toySets}
    />
{/if}
