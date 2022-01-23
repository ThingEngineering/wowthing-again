<script lang="ts">
    import { locationIcons } from '@/data/icons'
    import { petBreedMap } from '@/data/pet-breed'
    import { userAuctionExtraPetStore } from '@/stores'
    import connectedRealmName from '@/utils/connected-realm-name'
    import petLocationTooltip from '@/utils/pet-location-tooltip'
    import tippy from '@/utils/tippy'
    import type { UserAuctionDataAuction, UserAuctionDataPet } from '@/types/data'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    let data: [string, number, UserAuctionDataAuction[], UserAuctionDataPet[]][]
    $: {
        data = []
        if ($userAuctionExtraPetStore.data?.auctions) {
            for (const creatureId in $userAuctionExtraPetStore.data.auctions) {
                data.push([
                    $userAuctionExtraPetStore.data.names[creatureId],
                    parseInt(creatureId),
                    $userAuctionExtraPetStore.data.auctions[creatureId],
                    $userAuctionExtraPetStore.data.pets[creatureId],
                ])
            }
            data.sort()
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

<div class="wrapper">
    {#await userAuctionExtraPetStore.fetch(true) then _}
        {#each data as [name, creatureId, auctions, pets]}
            <div class="pet-wrapper">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th class="item" colspan="4">
                                <WowheadLink
                                    type="npc"
                                    id={creatureId}
                                >
                                    <WowthingImage
                                        name="npc/{creatureId}"
                                        size={20}
                                        border={1}
                                    />
                                    {name}
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
                            {#each pets as pet}
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
    {/await}
</div>
