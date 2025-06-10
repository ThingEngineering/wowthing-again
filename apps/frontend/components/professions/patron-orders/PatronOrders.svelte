<script lang="ts">
    import sortBy from 'lodash/sortBy';
    import xor from 'lodash/xor';
    import { afterUpdate } from 'svelte';

    import { isCraftingProfession } from '@/data/professions';
    import { staticStore } from '@/shared/stores/static';
    import { userStore } from '@/stores';
    import { userState } from '@/user-home/state/user';
    import getSavedRoute from '@/utils/get-saved-route';
    import { auctionsCommoditiesSpecificStore } from './auction-store';

    import Sidebar from './Sidebar.svelte';
    import Table from './Table.svelte';
    import { wowthingData } from '@/shared/stores/data';

    export let slug: string;

    const sortedProfessions = sortBy(
        Object.values($staticStore.professions).filter((prof) => isCraftingProfession[prof.id]),
        (prof) => [prof.type, prof.name]
    );

    let itemIds: number[];
    let regionIds: number[];
    $: {
        const uniqueItemIds: Set<number> = new Set();
        for (const character of $userStore.characters) {
            if (
                !sortedProfessions.some((prof) => character.patronOrders?.[prof.id] !== undefined)
            ) {
                continue;
            }

            for (const patronOrders of Object.values(character.patronOrders)) {
                for (const patronOrder of patronOrders) {
                    const { ability } = wowthingData.static.professionAbilityByAbilityId.get(
                        patronOrder.skillLineAbilityId
                    );
                    for (const reagent of ability.categoryReagents) {
                        for (const categoryId of reagent.categoryIds) {
                            for (const itemId of $staticStore.reagentCategories[categoryId] || []) {
                                uniqueItemIds.add(itemId);
                            }
                        }
                    }
                    for (const [, itemId] of ability.itemReagents) {
                        uniqueItemIds.add(itemId);
                    }
                }
            }
        }

        const sortedItemIds = sortBy(Array.from(uniqueItemIds), (id) => id);
        if (itemIds === undefined || xor(itemIds, sortedItemIds).length > 0) {
            itemIds = sortedItemIds;
        }

        const sortedRegionIds = sortBy(userState.general.allRegions, (region) => region);
        if (regionIds === undefined || xor(regionIds, sortedRegionIds).length > 0) {
            regionIds = sortedRegionIds;
        }
    }

    afterUpdate(() => getSavedRoute('professions/patron-orders', slug));
</script>

<Sidebar {sortedProfessions} />

{#await auctionsCommoditiesSpecificStore.search(regionIds, itemIds)}
    L O A D I N G . . .
{:then commodities}
    {#if slug === 'all'}
        <div class="wrapper-column">
            {#each sortedProfessions as profession}
                <Table {commodities} {profession} />
            {/each}
        </div>
    {:else}
        <Table {commodities} profession={sortedProfessions.find((prof) => prof.slug === slug)} />
    {/if}
{/await}
