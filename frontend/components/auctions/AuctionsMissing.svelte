<script lang="ts">
    import { timeLeft } from '@/data/auctions'
    import {
        userAuctionMissingMountStore,
        userAuctionMissingPetStore,
        userAuctionMissingToyStore,
    } from '@/stores'
    import connectedRealmName from '@/utils/connected-realm-name'
    import type { UserAuctionDataStore } from '@/stores'
    import type { UserAuctionDataAuction } from '@/types/data'

    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let slug: string

    let auctionStore: UserAuctionDataStore
    let items: [string, number, UserAuctionDataAuction[]][]
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
        items = []
        if ($auctionStore.data?.auctions) {
            for (const thingId in $auctionStore.data.auctions) {
                items.push([
                    $auctionStore.data.names[thingId],
                    parseInt(thingId),
                    $auctionStore.data.auctions[thingId],
                ])
            }
            items.sort()
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

<div class="wrapper">
    {#await auctionStore.fetch(true) then _}
        {#each (items || []) as [thingName, thingId, auctions]}
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th class="item" colspan="4">
                            <WowheadLink
                                type={thingType}
                                id={thingId}
                            >
                                <WowthingImage
                                    name="{thingType}/{thingId}"
                                    size={20}
                                    border={1}
                                />
                                {thingName}
                            </WowheadLink>
                        </th>
                    </tr>
                </thead>

                <tbody>
                {#each auctions as auction}
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
    {/await}
</div>
