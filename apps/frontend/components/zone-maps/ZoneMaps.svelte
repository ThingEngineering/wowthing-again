<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import {
        achievementStore,
        staticStore,
        transmogStore,
        userAchievementStore,
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

    onMount(async () => await Promise.all([
        achievementStore.fetch(),
    ]))

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $achievementStore.error || $userAchievementStore.error
        loaded = $achievementStore.loaded && $userAchievementStore.loaded
        ready = (!error && loaded)

        if (ready) {
            zoneMapStore.setup(
                $settings,
                $staticStore.data,
                $transmogStore.data,
                $userStore.data,
                $userAchievementStore.data,
                $userQuestStore.data,
                $userTransmogStore.data,
                $zoneMapStore.data,
                $zoneMapState,
            )
            ready = true
        }
    }

    afterUpdate(() => {
        if (ready) {
            getSavedRoute('zone-maps', params.slug1, params.slug2)
        }
    })
</script>

{#if !ready}
    L O A D I N G
{:else}
    <Sidebar />
    <Map
        slug1={params.slug1}
        slug2={params.slug2}
    />
{/if}
