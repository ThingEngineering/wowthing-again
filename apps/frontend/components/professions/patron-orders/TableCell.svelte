<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { timeState } from '@/shared/state/time.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { CharacterProps } from '@/types/props';
    import type { CommodityData } from './auction-store';

    import Order from './Order.svelte';
    import { browserState } from '@/shared/state/browser.svelte';

    type Props = CharacterProps & {
        commodities: CommodityData;
        profession: StaticDataProfession;
    };
    let { character, commodities, profession }: Props = $props();

    let now = $derived(timeState.slowTime.toUnixInteger());
    let activeOrders = $derived(
        sortBy(
            character.patronOrders?.[profession.id]?.filter(
                (order) =>
                    order.expirationTime > now &&
                    (browserState.current.professions.patronOrdersUnknown ||
                        character.professions?.[profession.id]?.knownRecipes?.has(
                            order.skillLineAbilityId
                        ))
            ) || [],
            (order) => `${order.expirationTime}:${wowthingData.items.items[order.itemId]?.name}`
        )
    );
</script>

<style lang="scss">
    td {
        --padding: 0;

        border-left: 1px solid var(--border-color);
        padding-bottom: 0;
        padding-top: 0;
        width: calc(5rem + 2.3rem + 20rem + 0.5rem);
    }
</style>

<td>
    {#if activeOrders}
        {#each activeOrders as patronOrder}
            <Order {character} {commodities} {patronOrder} />
        {:else}
            <Order {character} />
        {/each}
    {/if}
</td>
