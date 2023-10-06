<script lang="ts">
    import { Region } from '@/enums/region';
    import { auctionsSpecificDataStore } from '@/stores/auctions/specific'
    import { staticStore } from '@/stores/static'
    import { leftPad } from '@/utils/formatting'
    import tippy from '@/utils/tippy'

    export let selected: string

    function formatPrice(price: number): string {
        price = price / 100
        const silver = leftPad(price % 100, 2, '&nbsp;')
        const gold = Math.floor(price / 100)

        return gold ? `${gold.toLocaleString()}g ${silver}s` : `${silver}s`
    }
</script>

<style lang="scss">
    .selected {
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-gutter: stable;
    }
    td {
        padding: 0.15rem 0.4rem;
    }
    code {
        background: transparent;
        color: $body-text;
    }
    .realm {
        max-width: 20rem;
        width: 20rem;
    }
    .quantity {
        text-align: right;
        width: 5.5rem;
    }
    .price {
        text-align: right;
        width: 9.5rem;
    }
</style>

<div class="selected">
    {#await auctionsSpecificDataStore.search(selected)}
        L O A D I N G . . .
    {:then auctions}
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Realm</th>
                    <th>
                        {#if auctions[0]?.petSpeciesId}
                            Level
                        {:else}
                            Quantity
                        {/if}
                    </th>
                    <!-- {#if auctions[0]?.connectedRealmId < 100000}
                        <th>Bid</th>
                    {/if} -->
                    <th>Buyout</th>
                </tr>
            </thead>
            <tbody>
                {#each auctions as auction}
                    {@const realm = $staticStore.connectedRealms[auction.connectedRealmId]}
                    <tr>
                        <td
                            class="realm text-overflow"
                            use:tippy={realm.displayText}
                        >
                            <code>[{Region[realm.region]}]</code>
                            {realm.displayText}
                        </td>
                        <td class="quantity">
                            {#if auction.petSpeciesId}
                                <span class="quality{auction.petQuality}">
                                    {auction.petLevel}
                                </span>
                            {:else}
                                {auction.quantity.toLocaleString()}
                            {/if}
                        </td>
                        <!-- {#if auctions[0]?.connectedRealmId < 100000}
                            <td class="price">
                                {#if auction.bidPrice > 0}
                                    <code>{@html formatPrice(auction.bidPrice)}</code>
                                {/if}
                            </td>
                        {/if} -->
                        <td class="price">
                            <code>{@html formatPrice(auction.buyoutPrice)}</code>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/await}
</div>
