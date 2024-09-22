<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import { afterUpdate } from 'svelte';

    import { isCraftingProfession } from '@/data/professions';
    import { staticStore } from '@/shared/stores/static'
    import getSavedRoute from '@/utils/get-saved-route';

    import Sidebar from './Sidebar.svelte';
    import Table from './Table.svelte';
    import { userStore } from '@/stores';
    import { auctionsCommoditiesSpecificStore } from './auction-store';

    export let slug: string

    const sortedProfessions = sortBy(
        Object.values($staticStore.professions)
            .filter((prof) => isCraftingProfession[prof.id]),
        (prof) => [prof.type, prof.name]
    )

    let itemIds: Set<number>;
    $: {
        itemIds = new Set();
        for (const character of $userStore.characters) {
            if (!sortedProfessions.some((prof) => character.patronOrders?.[prof.id] !== undefined)) {
                continue;
            }

            for (const patronOrders of Object.values(character.patronOrders)) {
                for (const patronOrder of patronOrders) {
                    const ability = $staticStore.spellToProfessionAbility[
                        $staticStore.professionAbilityByAbilityId[patronOrder.skillLineAbilityId].spellId
                    ];
                    for (const reagent of ability.reagents) {
                        for (const categoryId of reagent.categoryIds) {
                            for (const itemId of $staticStore.reagentCategories[categoryId] || []) {
                                itemIds.add(itemId);
                            }
                        }
                    }
                }
            }
        }
    }

    afterUpdate(() => getSavedRoute('professions/patron-orders', slug))
</script>

<Sidebar {sortedProfessions} />

{#await auctionsCommoditiesSpecificStore.search([1], Array.from(itemIds))}
    L O A D I N G . . .
{:then commodities}
    {#if slug === 'all'}
        <div class="wrapper-column">
            {#each sortedProfessions as profession}
                <Table
                    {commodities}
                    {profession}
                />
            {/each}
        </div>
    {:else}
        <Table
            {commodities}
            profession={sortedProfessions.find((prof) => prof.slug === slug)}
        />
    {/if}
{/await}
