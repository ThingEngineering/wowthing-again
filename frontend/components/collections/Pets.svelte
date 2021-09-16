<script lang="ts">
    import { onMount } from 'svelte'

    import { staticStore, userCollectionStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    onMount(async () => await userCollectionStore.fetch())
</script>

{#if $userCollectionStore.loaded}
    <Collection
        route="pets"
        {params}
        thingType="npc"
        thingMap={$staticStore.data.creatureToPet}
        userHas={$userCollectionStore.petsHas}
        sets={$staticStore.data.petSets}
    />
{/if}
