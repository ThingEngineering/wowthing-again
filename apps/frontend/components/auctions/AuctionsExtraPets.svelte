<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { locationIcons } from '@/data/icons'
    import { petBreedMap } from '@/data/pet-breed'
    import { userAuctionExtraPetStore } from '@/stores'
    import { auctionState } from '@/stores/local-storage/auctions'
    import connectedRealmName from '@/utils/connected-realm-name'
    import petLocationTooltip from '@/utils/pet-location-tooltip'
    import tippy from '@/utils/tippy'
    import type { UserAuctionDataAuction, UserAuctionDataPet } from '@/types/data'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Paginate from '@/components/common/Paginate.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let page: number
    export let slug: string

    let things: { id: number, name: string, auctions: UserAuctionDataAuction[], pets: UserAuctionDataPet[] }[]
    $: {
        things = []
        if ($userAuctionExtraPetStore.data?.auctions) {
            for (const creatureId in $userAuctionExtraPetStore.data.auctions) {
                things.push({
                    id: parseInt(creatureId),
                    name: $userAuctionExtraPetStore.data.names[creatureId],
                    auctions: $userAuctionExtraPetStore.data.auctions[creatureId],
                    pets: $userAuctionExtraPetStore.data.pets[creatureId],
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
    table {
        --padding: 2;
    }
    .wrapper {
        column-count: 1;
        width: 37.5rem;

        @media screen and (min-width: 1600px) {
            column-count: 2;
            gap: 1rem;
            width: 76rem;
        }
    }
    .pet-wrapper {
        display: inline-flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
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
    .pet-location {
        padding-left: 0.25rem;

        :global(svg) {
            margin-top: -4px;
        }
    }
    .pet-level {
        @include cell-width(3.7rem);

        text-align: right;
    }
    .pet-breed {
        @include cell-width(2.0rem);

        text-align: center;
    }
</style>

{#await userAuctionExtraPetStore.fetch()}
    <div class="wrapper">L O A D I N G . . .</div>
{:then _}
    <Paginate
        items={things}
        perPage={20}
        {page}
        let:paginated
    >
        <div class="wrapper">
            {#each paginated as thing}
                <div class="pet-wrapper">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th class="item" colspan="4">
                                    <WowheadLink
                                        type="npc"
                                        id={thing.id}
                                    >
                                        <WowthingImage
                                            name="npc/{thing.id}"
                                            size={20}
                                            border={1}
                                        />
                                        {thing.name}
                                    </WowheadLink>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each thing.auctions as auction}
                                <tr>
                                    <td class="realm text-overflow">
                                        {connectedRealmName(auction.connectedRealmId)}
                                    </td>
                                    <td class="price">
                                        {Math.floor(auction.buyoutPrice / 10000).toLocaleString()} g
                                    </td>
                                    <td class="pet-level quality{auction.petQuality}">
                                        Level {auction.petLevel}
                                    </td>
                                    <td class="pet-breed">
                                        {petBreedMap[auction.petBreedId]}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>

                    <div class="pets">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th class="item" style="text-align: center" colspan="3">My Pets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each thing.pets as pet}
                                    <tr>
                                        <td
                                            class="pet-location drop-shadow"
                                            use:tippy={petLocationTooltip(pet)}
                                        >
                                            <IconifyIcon
                                                icon={locationIcons[pet.location]}
                                                scale="0.9"
                                            />
                                        </td>
                                        <td class="pet-level quality{pet.quality}">
                                            Level {pet.level}
                                        </td>
                                        <td class="pet-breed">
                                            {petBreedMap[pet.breedId]}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/each}
        </div>
    </Paginate>
{/await}
