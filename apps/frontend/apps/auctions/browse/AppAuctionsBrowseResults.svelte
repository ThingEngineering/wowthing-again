<script lang="ts">
    import { auctionsBrowseState } from '@/stores/local-storage/auctions-browse'
    import type { AuctionEntry } from '@/stores/auctions/types'

    import Row from './AppAuctionsBrowseResultsRow.svelte'
    import Selected from './AppAuctionsBrowseSelected.svelte'

    export let auctions: AuctionEntry[]
    export let selectedKey: string
</script>

<style lang="scss">
    .flex-wrapper {
        align-items: start;
        justify-content: flex-start;
        gap: 2rem;
    }
    .results {
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-gutter: stable;
    }
    .next-selected {
        th {
            border-bottom-width: 0;
        }
    }
</style>

<div class="flex-wrapper">
    <div class="results">
        <table class="table table-striped">
            <thead>
                <tr
                    class:next-selected={($auctionsBrowseState.resultsSelected[selectedKey] || 'ZZZ') === auctions[0]?.groupKey}
                >
                    <th colspan="2">Thing</th>
                    <th>Listed</th>
                    <th>Cheapest</th>
                </tr>
            </thead>
            <tbody>
                {#each auctions as auction, auctionIndex}
                    <Row
                        nextSelected={($auctionsBrowseState.resultsSelected[selectedKey] || 'ZZZ') === auctions[auctionIndex + 1]?.groupKey}
                        {auction}
                        {selectedKey}
                    />
                {:else}
                    <Row
                        auction={null}
                        nextSelected={false}
                        selectedKey={null}
                    />
                {/each}
            </tbody>
        </table>
    </div>

    {#if $auctionsBrowseState.resultsSelected[selectedKey]}
        <Selected selected={$auctionsBrowseState.resultsSelected[selectedKey]} />
    {/if}
</div>
