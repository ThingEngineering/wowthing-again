<script lang="ts">
    import { auctionsSearchDataStore } from '@/stores/auctions/search'
    import type { MultiSlugParams } from '@/types'

    import Results from '../browse/AppAuctionsBrowseResults.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'

    export let params: MultiSlugParams
</script>

<style lang="scss">

</style>

<div class="wrapper-column">
    <UnderConstruction />

    {#if params.slug1}
        <div class="header">
            SEARCH REGION=US &gt; "{params.slug1}"
        </div>

        {#await auctionsSearchDataStore.search(params.slug1)}
            L O A D I N G . . .
        {:then auctions}
            <Results
                selectedKey={`search:${params.slug1}`}
                {auctions}
            />
        {/await}
    {/if}
</div>
