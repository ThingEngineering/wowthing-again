<script lang="ts">
    import type { AuctionEntry } from '@/auctions/types/auction-entry'

    import Row from './ResultsRow.svelte'
    import Selected from './Selected.svelte'

    export let loadFunc: () => Promise<AuctionEntry[]>
    export let selected: string
    export let url: string
</script>

<style lang="scss">
    table {
        thead th {
            border-bottom-width: 0;
        }
        :global(tbody tr:first-child td) {
            border-top: 1px solid $border-color;
        }
    }
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
                    <th class="item-level">ILvl</th>
                    <th class="quantity">Listed</th>
                    <th class="price">Cheapest</th>
                </tr>
            </thead>
            <tbody>
                {#await loadFunc()}
                    <Row loading={true} />
                {:then auctions}
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
                {/await}
            </tbody>
        </table>
    </div>

    {#if selected}
        <Selected {selected} />
    {/if}
</div>
