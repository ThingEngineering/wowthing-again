<script lang="ts">
    // import { timeLeft } from '@/data/auctions'
    // import { userAuctionMissingStore } from '@/stores'
    // import { auctionState } from '@/stores/local-storage/auctions'
    // import connectedRealmName from '@/utils/connected-realm-name'

    // import Paginate from '@/components/common/Paginate.svelte'
    // import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    // import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    // export let page: number
    // export let slug: string

    // let categoryId: number
    // $: {
    //     categoryId = parseInt(slug.replace('custom-', ''))
    // }
</script>
 
<style lang="scss">
    // .wrapper {
    //     column-count: 1;
    //     width: 31rem;

    //     @media screen and (min-width: 1430px) and (max-width: 1919px) {
    //         column-count: 2;
    //         gap: 1rem;
    //         width: 63rem;
    //     }
    //     @media screen and (min-width: 1920px) {
    //         column-count: 3;
    //         gap: 1rem;
    //         width: 95rem;
    //     }
    // }
    // table {
    //     --padding: 2;

    //     display: inline-block;
    //     margin-bottom: 0.5rem;
    // }
    // .item {
    //     --image-border-width: 1px;
    //     --image-margin-top: -4px;

    //     background-color: $highlight-background;
    //     font-weight: normal;
    //     padding: 0.2rem $width-padding;
    //     text-align: left;
    // }
    // .realm {
    //     @include cell-width(10.0rem);
    // }
    // .level {
    //     @include cell-width(1.8rem);

    //     text-align: right;
    //     white-space: nowrap;
    // }
    // .price {
    //     @include cell-width(4.5rem);

    //     text-align: right;
    //     white-space: nowrap;

    //     &.no-bid {
    //         color: #7f7f7f;
    //     }
    // }
    // .time-left {
    //     @include cell-width(4.2rem);

    //     text-align: right;
    //     word-spacing: -0.2ch;
    // }
</style>

<!--
{#await userAuctionMissingStore.search($auctionState, searchType)}
    <div class="wrapper">L O A D I N G . . .</div>
{:then things}
    <Paginate
        items={things || []}
        perPage={20}
        {page}
        let:paginated
    >
        <div class="wrapper">
            {#each paginated as item}
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th class="item" colspan="{slug === 'missing-pets' ? 5 : 4}">
                                <WowheadLink
                                    type={thingType}
                                    id={item.id}
                                >
                                    <WowthingImage
                                        name="{thingType}/{item.id}"
                                        size={20}
                                        border={1}
                                    />
                                    {item.name}
                                </WowheadLink>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each item.auctions as auction}
                            <tr>
                                <td class="realm text-overflow">
                                    {connectedRealmName(auction.connectedRealmId)}
                                </td>
                                {#if slug === 'missing-pets'}
                                    <td class="level quality{auction.petQuality}">
                                        {auction.petLevel}
                                    </td>
                                {/if}
                                <td
                                    class="price"
                                    class:no-bid={auction.bidPrice === 0}
                                >
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
        </div>
    </Paginate>
{/await}
-->