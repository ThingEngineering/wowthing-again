<script lang="ts">
    import { auctionsAppState } from '@/auctions/stores/state';
    import { specificStore } from '@/auctions/stores/specific';
    import { euLocales } from '@/data/region';
    import { Region } from '@/enums/region';
    import { wowthingData } from '@/shared/stores/data';
    import { leftPad } from '@/utils/formatting';
    import { applyBonusIds } from '@/utils/items/apply-bonus-ids';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    export let selected: string;

    function formatPrice(price: number): string {
        price = price / 100;
        const silver = leftPad(price % 100, 2, '&nbsp;');
        const gold = Math.floor(price / 100);

        return gold ? `${gold.toLocaleString()}g ${silver}s` : `${silver}s`;
    }
</script>

<style lang="scss">
    .selected {
        max-height: 80vh;
        overflow-y: auto;
        scrollbar-gutter: stable;
    }
    td {
        padding: 0.1rem 0.4rem;
    }
    code {
        background: transparent;
        color: var(--color-body-text);
    }
    .realm {
        --image-margin-top: -4px;
        --shadow-color: #bbb;

        max-width: 20rem;
        width: 20rem;
    }
    .quantity {
        text-align: right;
        width: 3.5rem;
    }
    .level {
        text-align: right;
        width: 3rem;
    }
    .price {
        text-align: right;
        width: 9.5rem;
    }
</style>

<div class="selected">
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Realm</th>
                <th>Qty</th>
                <th>Lvl</th>
                <!-- {#if auctions[0]?.connectedRealmId < 100000}
                    <th>Bid</th>
                {/if} -->
                <th>Buyout</th>
            </tr>
        </thead>
        <tbody>
            {#await specificStore.search($auctionsAppState, selected)}
                <tr>
                    <td class="realm">L O A D I N G . . .</td>
                    <td class="quantity"></td>
                    <td class="level"></td>
                    <td class="price"></td>
                </tr>
            {:then auctions}
                {#each auctions as auction}
                    {@const realm = wowthingData.static.connectedRealmById.get(
                        auction.connectedRealmId
                    )}
                    <tr>
                        <td class="realm text-overflow" data-tooltip={realm.displayText}>
                            <!-- <code>[{Region[realm.region]}]</code> -->
                            {#if realm.region === Region.EU && euLocales[realm.locale]}
                                {@const { icon: countryIcon, name: countryName } =
                                    euLocales[realm.locale]}
                                <IconifyWrapper
                                    dropShadow={true}
                                    icon={countryIcon}
                                    tooltip={`EU: ${countryName}`}
                                />
                            {/if}

                            {realm.displayText}
                        </td>
                        <td class="quantity">
                            {auction.quantity.toLocaleString()}
                        </td>
                        <td class="level">
                            {#if auction.petSpeciesId}
                                <span class="quality{auction.petQuality}">
                                    {auction.petLevel}
                                </span>
                            {:else}
                                {@const item = wowthingData.items.items[auction.itemId]}
                                {#if item}
                                    {@const { itemLevel, quality } = applyBonusIds(
                                        auction.bonusIds,
                                        { itemLevel: item.itemLevel, quality: item.quality }
                                    )}
                                    <span class="quality{quality}">
                                        {itemLevel}
                                    </span>
                                {/if}
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
                {:else}
                    <tr>
                        <td class="realm"> No results! </td>
                        <td class="quantity"></td>
                        <td class="price">
                            <code></code>
                        </td>
                    </tr>
                {/each}
            {/await}
        </tbody>
    </table>
</div>
