<script lang="ts">
    import { onMount } from 'svelte'

    import { auctionStore } from '@/stores/auction'

    import AuctionsSidebar from './AppAuctionsSidebar.svelte'

    onMount(async () => await Promise.all([
        auctionStore.fetch(),
    ]))

    let error: boolean
    let loaded: boolean
    $: {
        error = $auctionStore.error
        loaded = $auctionStore.loaded
    }
</script>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !loaded}
    <p>L O A D I N G</p>
{:else}
    <AuctionsSidebar />
{/if}
