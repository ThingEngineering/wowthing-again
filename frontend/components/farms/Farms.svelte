<script lang="ts">
    import {afterUpdate, onMount} from 'svelte'

    import {
        farmStore,
        transmogStore,
        userPetStore,
        userQuestStore,
        userStore,
        userTransmogStore
    } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type {MultiSlugParams} from '@/types'

    import Map from './FarmsMap.svelte'
    import Sidebar from './FarmsSidebar.svelte'

    export let params: MultiSlugParams

    let loaded: boolean
    $: {
        loaded = $farmStore.loaded &&
            $transmogStore.loaded &&
            $userPetStore.loaded &&
            $userQuestStore.loaded &&
            $userStore.loaded &&
            $userTransmogStore.loaded

        if (loaded) {
            userTransmogStore.setup()
        }
    }

    onMount(async () => await Promise.all([
        farmStore.fetch(),
        transmogStore.fetch(),
        userPetStore.fetch(),
        userQuestStore.fetch(),
        userStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    afterUpdate(() => {
        if (loaded) {
            getSavedRoute('farms', params.slug1, params.slug2)
        }
    })
</script>

{#if !loaded}
    L O A D I N G
{:else}
    <Sidebar />
    <Map slug1={params.slug1} slug2={params.slug2} />
{/if}
