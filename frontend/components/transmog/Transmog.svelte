<script lang="ts">
    import { onMount } from 'svelte'

    import {transmogStore} from '@/stores'

    import TransmogSidebar from './TransmogSidebar.svelte'
    import TransmogTable from './TransmogTable.svelte'

    export let params: {
        slug: string
    }

    onMount(async () => await transmogStore.fetch())

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $transmogStore.error
        loaded = $transmogStore.loaded
        ready = (!error && loaded)
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
        <TransmogTable slug={params.slug} />
    {/if}
</div>
