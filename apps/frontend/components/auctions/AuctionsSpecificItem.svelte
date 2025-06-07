<script lang="ts">
    import { timeLeft } from '@/data/auctions';
    import { Region } from '@/enums/region';
    import { userStore, userAuctionSpecificItemStore } from '@/stores';
    import { staticStore } from '@/shared/stores/static';
    import { auctionState } from '@/stores/local-storage';
    import connectedRealmName from '@/utils/connected-realm-name';
    import { basicTooltip } from '@/shared/utils/tooltips';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let slug2: string;

    $: itemId = parseInt(slug2);
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
    }
    th {
        background-color: $highlight-background;
        font-weight: normal;
    }
    .item {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 0.2rem $width-padding;
        text-align: left;
    }
    // .ignore {
    //     font-weight: normal;
    //     padding-right: 0.6rem;
    //     text-align: right;
    //     white-space: nowrap;

    //     span {
    //         cursor: pointer;

    //         &:hover {
    //             color: $link-color;
    //         }
    //     }
    // }
    .realm {
        @include cell-width(11rem, $paddingLeft: 0px);
    }
    // .level {
    //     @include cell-width(1.8rem);

    //     text-align: right;
    //     white-space: nowrap;
    // }
    .price {
        @include cell-width(4.5rem);

        text-align: right;
        white-space: nowrap;

        &.no-bid {
            color: #7f7f7f;
        }
    }
    .time-left {
        @include cell-width(4.2rem);

        text-align: right;
        word-spacing: -0.2ch;
    }
</style>

{#await userAuctionSpecificItemStore.search($auctionState, $userStore, itemId)}
    <div class="wrapper">L O A D I N G . . .</div>
{:then [things]}
    {#each things as item}
        {@const auctions = $auctionState.limitToBestRealms
            ? item.auctions.slice(0, 5)
            : item.auctions}
        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="item" colspan="4">
                        <WowheadLink type="item" id={parseInt(item.id)}>
                            <WowthingImage name="item/{item.id}" size={20} border={1} />
                            <ParsedText text={`{item:${item.id}}`} />
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
                            use:basicTooltip={connectedRealm.realmNames.join(' / ')}
                        >
                            <code>[{Region[connectedRealm.region]}]</code>
                            {connectedRealmName(auction.connectedRealmId)}
                        </td>
                        <td class="price" class:no-bid={auction.bidPrice === 0}>
                            {#if auction.bidPrice > 0}
                                {Math.floor(auction.bidPrice / 10000).toLocaleString()} g
                            {:else}
                                &lt;no bid&gt;
                            {/if}
                        </td>
                        <td
                            class="price"
                            class:no-bid={auction.bidPrice > 0 && auction.buyoutPrice === 0}
                        >
                            {#if auction.bidPrice > 0 && auction.buyoutPrice === 0}
                                &lt;no b/o&gt;
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
    {:else}
        No results!
    {/each}
{/await}
