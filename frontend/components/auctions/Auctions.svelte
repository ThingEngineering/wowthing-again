<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { userAuctionStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './AuctionsSidebar.svelte'
    import View from './AuctionsView.svelte'

    export let params: MultiSlugParams

    onMount(async () => await userAuctionStore.fetch())
    afterUpdate(() => getSavedRoute('auctions', params.slug1))

    let error: boolean
    let loaded: boolean
    $: {
        error = $userAuctionStore.error
        loaded = $userAuctionStore.loaded
    }
</script>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !loaded}
    <p>L O A D I N G</p>
{:else}
    <Sidebar />
    <View slug={params.slug1} />
{/if}
