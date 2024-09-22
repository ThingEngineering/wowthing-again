<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { timeStore } from '@/shared/stores/time';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { Character } from '@/types';
    import type { CommodityData } from './auction-store';

    import Order from './Order.svelte';

    export let character: Character;
    export let commodities: CommodityData;
    export let profession: StaticDataProfession;

    $: now = $timeStore.toUnixInteger();
    $: activeOrders = sortBy(
        character.patronOrders?.[profession.id]?.filter((order) => order.expirationTime > now) || [],
        (order) => order.expirationTime
    );
</script>

<style lang="scss">
    td {
        border-left: 1px solid $border-color;
        padding: 0 0.3rem;
        width: calc(5rem + 2.3rem + 20rem + 0.5rem);
    }
</style>

<td>
    {#if activeOrders}
        {#each activeOrders as patronOrder}
            <Order
                {character}
                {commodities}
                {patronOrder}
            />
        {:else}
            No active patron orders!
        {/each}
    {/if}
</td>
