<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import {transmogStore, userTransmogStore} from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

    import TransmogSidebar from './TransmogSidebar.svelte'
    import TransmogTable from './TransmogTable.svelte'

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
            userTransmogStore.setup()
        }
    }

    onMount(async () => await Promise.all([
        transmogStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    afterUpdate(() => getSavedRoute('transmog', params.slug1, params.slug2))
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
        <TransmogSidebar />
        <TransmogTable slug1={params.slug1} slug2={params.slug2} />
    {/if}
</div>
