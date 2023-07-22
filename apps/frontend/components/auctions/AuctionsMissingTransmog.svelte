<script lang="ts">
    import { timeLeft } from '@/data/auctions'
    import { Region } from '@/enums'
    import { itemStore, staticStore, userAuctionMissingTransmogStore } from '@/stores'
    import { auctionState } from '@/stores/local-storage'
    import connectedRealmName from '@/utils/connected-realm-name'
    import tippy from '@/utils/tippy'

    import Paginate from '@/components/common/Paginate.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import ParsedText from '../common/ParsedText.svelte';
    import { toNicePrice } from '@/utils/formatting';
    import { getColumnResizer } from '@/utils/get-column-resizer';

    export let auctionsContainer: HTMLElement
    export let page: number

    let debouncedResize: () => void
    let wrapperDiv: HTMLElement
    $: {
        console.log(auctionsContainer, wrapperDiv)
        if (wrapperDiv) {
            debouncedResize = getColumnResizer(auctionsContainer, wrapperDiv, 'table')
            debouncedResize()
        }
    }
</script>

<style lang="scss">
    .wrapper {
        column-count: 1;
        gap: 20px;
    }
    table {
        --padding: 2;

        display: inline-block;
        margin-bottom: 0.5rem;
        width: 23.5rem;
    }
    th {
        background-color: $highlight-background;
        font-weight: normal;
    }
    .item {
        --image-border-width: 1px;
        // --image-margin-top: -4px;

        max-width: 22rem;
        padding: 0.2rem $width-padding;
        text-align: left;

        .flex-wrapper {
            justify-content: start;
            gap: 0.5rem;
        }

        :global(.text-overflow) {
            text-align: left;
        }
    }
    .realm {
        @include cell-width(11.0rem, $paddingLeft: 0px);
    }
    .price {
        @include cell-width(5.5rem);

        text-align: right;
        white-space: nowrap;
    }
    .time-left {
        @include cell-width(4.2rem);

        text-align: right;
        word-spacing: -0.2ch;
    }
</style>

<svelte:window on:resize={debouncedResize} />

{#await userAuctionMissingTransmogStore.search($auctionState, $itemStore)}
    <div class="wrapper">L O A D I N G . . .</div>
{:then things}
    <Paginate
        items={(things || [])}
        perPage={$auctionState.allRealms && !$auctionState.limitToBestRealms ? 12 : 24}
        {page}
        let:paginated
    >
        <div class="wrapper" bind:this={wrapperDiv}>
            {#each paginated as item}
                {@const auctions = $auctionState.limitToBestRealms ? item.auctions.slice(0, 5) : item.auctions}
                {@const itemId = auctions[0].itemId}
                <table
                    class="table table-striped"
                >
                    <thead>
                        <tr>
                            <th class="item text-overflow" colspan="3">
                                <WowheadLink
                                    type={'item'}
                                    id={itemId}
                                >
                                    <div class="flex-wrapper">
                                        <WowthingImage
                                            name="item/{itemId}"
                                            size={20}
                                            border={1}
                                        />
                                        <ParsedText
                                            cls="text-overflow"
                                            text={'{' + `item:${itemId}` + '}'}
                                        />
                                    </div>
                                </WowheadLink>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each auctions as auction}
                            {@const connectedRealm = $staticStore.connectedRealms[auction.connectedRealmId]}
                            <tr>
                                <td
                                    class="realm text-overflow"
                                    use:tippy={connectedRealm.realmNames.join(' / ')}
                                >
                                    <code>[{Region[connectedRealm.region]}]</code>
                                    {connectedRealmName(auction.connectedRealmId)}
                                </td>
                                <td
                                    class="price"
                                    use:tippy={`${auction.buyoutPrice.toLocaleString()} copper`}
                                >
                                    {#if auction.buyoutPrice < 10000}
                                        &lt;1 g
                                    {:else}
                                        {Math.floor(auction.buyoutPrice / 10000).toLocaleString()} g
                                    {/if}
                                </td>
                                <td
                                    class="time-left"
                                    class:status-fail={auction.timeLeft === 0}
                                    class:status-shrug={auction.timeLeft === 1}
                                    class:status-success={auction.timeLeft > 1}
                                >
                                    {timeLeft[auction.timeLeft]}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/each}
        </div>
    </Paginate>
{/await}
