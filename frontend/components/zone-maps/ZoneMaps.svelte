<script lang="ts">
    import {afterUpdate, onMount} from 'svelte'

    import {
        staticStore,
        transmogStore,
        userQuestStore,
        userStore,
        userTransmogStore,
        zoneMapStore,
    } from '@/stores'
    import {zoneMapState} from '@/stores/local-storage/zone-map'
    import { data as settings } from '@/stores/settings'
    import getSavedRoute from '@/utils/get-saved-route'
    import type {MultiSlugParams} from '@/types'

    import Map from './ZoneMapsMap.svelte'
    import Sidebar from './ZoneMapsSidebar.svelte'

    export let params: MultiSlugParams

    let loaded: boolean
    $: {
        loaded = $userQuestStore.loaded
    }

    $: {
        if (loaded) {
            zoneMapStore.setup(
                $settings,
                $staticStore.data,
                $transmogStore.data,
                $userQuestStore.data,
                $userStore.data,
                $userTransmogStore.data,
                $zoneMapStore.data,
                $zoneMapState,
            )
        }
    }

    onMount(async () => await userQuestStore.fetch())

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
