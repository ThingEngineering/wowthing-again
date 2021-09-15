<script lang="ts">
    import { onMount } from 'svelte'

    import { staticStore } from '@/stores/static'
    import {userCollectionStore} from '@/stores'
    import type {MultiSlugParams} from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams

    onMount(async () => await userCollectionStore.fetch())
</script>

{#if $userCollectionStore.loaded}
    <Collection
        route="mounts"
        {params}
        thingType="spell"
        thingMap={$staticStore.data.spellToMount}
        userHas={$userCollectionStore.data.mounts}
        sets={$staticStore.data.mountSets}
    />
{/if}
