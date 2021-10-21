<script lang="ts">
    import {afterUpdate, onMount} from 'svelte'

    import {
        zoneMapStore,
        transmogStore,
        userCollectionStore,
        userQuestStore,
        userStore,
        userTransmogStore
    } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type {MultiSlugParams} from '@/types'

    import Map from './ZoneMapsMap.svelte'
    import Sidebar from './ZoneMapsSidebar.svelte'

    export let params: MultiSlugParams

    let loaded: boolean
    $: {
        loaded = $zoneMapStore.loaded &&
            $transmogStore.loaded &&
            $userCollectionStore.loaded &&
            $userQuestStore.loaded &&
            $userStore.loaded &&
            $userTransmogStore.loaded

        if (loaded) {
            userTransmogStore.setup()
        }
    }

    onMount(async () => await Promise.all([
        zoneMapStore.fetch(),
        transmogStore.fetch(),
        userCollectionStore.fetch(),
        userQuestStore.fetch(),
        userStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    afterUpdate(() => {
        if (loaded) {
            getSavedRoute('zone-maps', params.slug1, params.slug2)
        }
    })
</script>

{#if !loaded}
    L O A D I N G
{:else}
    <Sidebar />
    <Map
        slug1={params.slug1}
        slug2={params.slug2}
    />
{/if}
