<script lang="ts">
    import { onMount } from 'svelte'

    import {transmogStore, userTransmogStore} from '@/stores'

    import TransmogSidebar from './TransmogSidebar.svelte'
    import TransmogTable from './TransmogTable.svelte'

    export let params: {
        slug1: string
        slug2: string
    }

    onMount(async () => await transmogStore.fetch())
    onMount(async () => await userTransmogStore.fetch())

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
