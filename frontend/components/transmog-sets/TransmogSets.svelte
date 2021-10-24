<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { transmogStore, userTransmogStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './TransmogSetsSidebar.svelte'
    import Table from './TransmogSetsTable.svelte'
    import { data as settings } from '../../stores/settings'

    export let params: {
        slug1: string
        slug2: string
    }

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $transmogStore.error || $userTransmogStore.error
        loaded = $transmogStore.loaded && $userTransmogStore.loaded
        ready = (!error && loaded && $userTransmogStore.data.has !== null)

        if (!error && loaded) {
            userTransmogStore.setup(
                $settings,
                $transmogStore.data,
                $userTransmogStore.data,
            )
        }
    }

    onMount(async () => await Promise.all([
        transmogStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    afterUpdate(() => getSavedRoute('transmog-sets', params.slug1, params.slug2))
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    {#if error}
        <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
    {:else if !ready}
        <p>L O A D I N G</p>
    {:else}
        <Sidebar />
        <Table slug1={params.slug1} slug2={params.slug2} />
    {/if}
</div>
