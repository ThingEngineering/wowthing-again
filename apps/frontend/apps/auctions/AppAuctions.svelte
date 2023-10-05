<script lang="ts">
    import { onMount } from 'svelte'

    import { auctionStore } from '@/stores/auction'
    import { itemStore } from '@/stores/item'
    import { staticStore } from '@/stores/static'

    import AuctionsRoutes from './AppAuctionsRoutes.svelte'
    import AuctionsSidebar from './AppAuctionsSidebar.svelte'

    onMount(async () => await Promise.all([
        auctionStore.fetch(),
        itemStore.fetch(),
        staticStore.fetch(),
    ]))

    let error: boolean
    let loaded: boolean
    $: {
        error = $auctionStore.error || $itemStore.error || $staticStore.error
        loaded = $auctionStore.loaded && $itemStore.loaded && $staticStore.loaded

        if (loaded) {
            staticStore.setup(undefined)
        }
    }
</script>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !loaded}
    <p>L O A D I N G</p>
{:else}
    <AuctionsSidebar />
    <AuctionsRoutes />
{/if}
