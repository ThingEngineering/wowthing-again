<script lang="ts">
    import { staticStore, userAuctionStore } from '@/stores'
    import type { UserAuctionDataAuction } from '@/types/data'

    import GoldPrice from '@/components/common/GoldPrice.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let slug: string

    let items: [string, number, UserAuctionDataAuction[]]
    let thingType: string
    $: {
        let auctionMap: Record<number, UserAuctionDataAuction[]>
        if (slug === 'missing-mounts') {
            auctionMap = $userAuctionStore.data.missingMounts
            thingType = 'spell'
        }
        else if (slug === 'missing-pets') {
            auctionMap = $userAuctionStore.data.missingPets
            thingType = 'npc'
        }
        else if (slug === 'missing-toys') {
            auctionMap = $userAuctionStore.data.missingToys
            thingType = 'item'
        }
        else {
            auctionMap = []
        }

        items = []
        for (const thingId in auctionMap) {
            let name: string
            if (slug === 'missing-mounts') {
                name = $userAuctionStore.data.mountNames[thingId]
            }
            else if (slug === 'missing-toys') {
                name = $userAuctionStore.data.itemNames[thingId]
            }
            else if (slug.endsWith('-pets')) {
                name = $userAuctionStore.data.petNames[thingId]
            }

            items.push([
                name,
                thingId,
                auctionMap[thingId],
            ])
        }
        items.sort()
    }

    const timeLeft: Record<number, string> = {
        0: '< 30m',
        1: '30m - 2h',
        2: '2h - 12h',
        3: '12h - 48h',
    }
</script>

<style lang="scss">
    .wrapper {
        column-count: 1;
        width: 40rem;

        @media screen and (min-width: 1570px) {
            column-count: 2;
            gap: 1rem;
            width: 75rem;
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
        @include cell-width(18.0rem);
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
    {#each items as [thingName, thingId, auctions]}
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
                            {$staticStore.data.connectedRealms[auction.connectedRealmId]}
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
