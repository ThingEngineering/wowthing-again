<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { timeLeft } from '@/data/auctions'
    import {
        userAuctionMissingMountStore,
        userAuctionMissingPetStore,
        userAuctionMissingToyStore,
    } from '@/stores'
    import { auctionState } from '@/stores/local-storage/auctions'
    import connectedRealmName from '@/utils/connected-realm-name'
    import type { UserAuctionDataStore } from '@/stores'
    import type { UserAuctionDataAuction } from '@/types/data'

    import Paginate from '@/components/common/Paginate.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let page: number
    export let slug: string

    let auctionStore: UserAuctionDataStore
    let things: { id: number, name: string, auctions: UserAuctionDataAuction[] }[]
    let thingType: string

    $: {
        if (slug === 'missing-mounts') {
            auctionStore = userAuctionMissingMountStore
            thingType = 'spell'
        }
        else if (slug === 'missing-pets') {
            auctionStore = userAuctionMissingPetStore
            thingType = 'npc'
        }
        else if (slug === 'missing-toys') {
            auctionStore = userAuctionMissingToyStore
            thingType = 'item'
        }
    }

    $: {
        things = []
        if ($auctionStore.data?.auctions) {
            for (const thingId in $auctionStore.data.auctions) {
                things.push({
                    id: parseInt(thingId),
                    name: $auctionStore.data.names[thingId],
                    auctions: $auctionStore.data.auctions[thingId],
                })
            }

            const sortState = $auctionState.sortBy[slug] || 'name_up'
            if (sortState === 'name_down') {
                things = sortBy(things, (item) => item.name)
                things.reverse()
            }
            else if (sortState === 'price_up') {
                things = sortBy(things, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
            }
            else if (sortState === 'price_down') {
                things = sortBy(things, (item) => item.auctions[0].bidPrice || item.auctions[0].buyoutPrice)
                things.reverse()
            }
            // name_up is default
            else {
                things = sortBy(things, (item) => item.name)
            }
        }
    }
</script>

<style lang="scss">
    .wrapper {
        column-count: 1;
        width: 31rem;

        @media screen and (min-width: 1430px) and (max-width: 1919px) {
            column-count: 2;
            gap: 1rem;
            width: 63rem;
        }
        @media screen and (min-width: 1920px) {
            column-count: 3;
            gap: 1rem;
            width: 95rem;
        }
    }
    table {
        --padding: 2;

        display: inline-block;
        margin-bottom: 0.5rem;
    }
    .item {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        background-color: $highlight-background;
        font-weight: normal;
        padding: 0.2rem $width-padding;
        text-align: left;
    }
    .realm {
        @include cell-width(12.0rem);
    }
    .price {
        @include cell-width(5.3rem);

        text-align: right;

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

{#await auctionStore.fetch()}
    <div class="wrapper">L O A D I N G . . .</div>
{:then _}
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
                            <th class="item" colspan="4">
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
                                <td class="price">
                                    {Math.floor(auction.buyoutPrice / 10000).toLocaleString()} g
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
