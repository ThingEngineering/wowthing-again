<script lang="ts">
    import type { AuctionEntry } from '@/stores/auctions/types'

    import Row from './AppAuctionsBrowseResultsRow.svelte'
    import Selected from './AppAuctionsBrowseSelected.svelte'

    export let auctions: AuctionEntry[]
    export let selected: string
    export let url: string
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
        <table class="table table-striped auctions-table">
            <thead>
                <tr
                    class:next-selected={false}
                >
                    <th class="icon"></th>
                    <th class="name">Thing</th>
                    <th class="quantity">Listed</th>
                    <th class="price">Cheapest</th>
                </tr>
            </thead>
            <tbody>
                {#each auctions as auction, auctionIndex}
                    <Row
                        baseUrl={url}
                        nextSelected={(selected || 'ZZZ') === auctions[auctionIndex + 1]?.groupKey}
                        selected={(selected || 'ZZZ') === auction.groupKey}
                        {auction}
                    />
                {:else}
                    <Row />
                {/each}
            </tbody>
        </table>
    </div>

    {#if selected}
        <Selected {selected} />
    {/if}
</div>
