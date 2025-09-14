<script lang="ts">
    import { afterUpdate } from 'svelte';

    import { petBreedMap } from '@/data/pet-breed';
    import { ItemLocation } from '@/enums/item-location';
    import { itemLocationIcons } from '@/shared/icons/mappings';
    import { userAuctionExtraPetsStore } from '@/stores';
    import { auctionState } from '@/stores/local-storage/auctions';
    import connectedRealmName from '@/utils/connected-realm-name';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import petLocationTooltip from '@/utils/pet-location-tooltip';
    import { basicTooltip } from '@/shared/utils/tooltips';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Paginate from '@/shared/components/paginate/Paginate.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let auctionsContainer: HTMLElement;
    export let page: number;

    let debouncedResize: () => void;
    let wrapperDiv: HTMLElement;
    $: {
        if (wrapperDiv) {
            debouncedResize = getColumnResizer(auctionsContainer, wrapperDiv, 'pet-wrapper');
            debouncedResize();
        }
    }

    afterUpdate(() => debouncedResize?.());
</script>

<style lang="scss">
    .wrapper {
        column-count: 1;
        gap: 20px;
    }
    .pet-wrapper {
        align-items: flex-start;
        display: inline-flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    table {
        --padding: 2;
    }
    .item {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        background-color: var(--color-highlight-background);
        font-weight: normal;
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
        text-align: left;
    }
    .realm {
        --width: 12rem;

        max-width: var(--width);
    }
    .price {
        --padding-left: 0;
        --width: 5.7rem;

        text-align: right;

        &.no-bid {
            color: #7f7f7f;
        }
    }
    .pet-location {
        --padding-left: 0.1rem;

        :global(svg) {
            margin-top: -4px;
        }
    }
    .pet-level {
        --padding-left: 0;
        --width: 1.8rem;

        text-align: right;
    }
    .pet-breed {
        --padding-left: 0;
        --padding-right: 0.1rem;
        --width: 2.6rem;

        text-align: center;
        letter-spacing: 0.2ch;
    }
</style>

<svelte:window on:resize={debouncedResize} />

{#await userAuctionExtraPetsStore.search($auctionState)}
    <div class="wrapper">L O A D I N G . . .</div>
{:then things}
    <Paginate items={things} perPage={20} {page} let:paginated>
        <div class="wrapper" bind:this={wrapperDiv}>
            {#each paginated as thing}
                {@const auctions = $auctionState.limitToBestRealms
                    ? thing.auctions.slice(0, 5)
                    : thing.auctions}
                <div class="pet-wrapper">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th class="item" colspan="4">
                                    <WowheadLink type="npc" id={thing.id}>
                                        <WowthingImage name="npc/{thing.id}" size={20} border={1} />
                                        {thing.name}
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
                                        {auction.petLevel}
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
                                    <th class="item" style="text-align: center" colspan="3"
                                        >My Pets</th
                                    >
                                </tr>
                            </thead>
                            <tbody>
                                {#each thing.pets as pet}
                                    {#if !$auctionState.extraPetsIgnoreJournal || pet.location !== ItemLocation.PetCollection}
                                        <tr>
                                            <td
                                                class="pet-location"
                                                data-location={pet.location}
                                                use:basicTooltip={petLocationTooltip(pet)}
                                            >
                                                <IconifyIcon
                                                    extraClass="drop-shadow"
                                                    icon={itemLocationIcons[pet.location]}
                                                    scale="0.9"
                                                />
                                            </td>
                                            <td class="pet-level quality{pet.quality}">
                                                {pet.level}
                                            </td>
                                            <td class="pet-breed" data-breed={pet.breedId}>
                                                {petBreedMap[pet.breedId]}
                                            </td>
                                        </tr>
                                    {/if}
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/each}
        </div>
    </Paginate>
{/await}
