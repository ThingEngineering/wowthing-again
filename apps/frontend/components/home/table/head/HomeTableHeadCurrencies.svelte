<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { SortableProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/currency/TooltipCurrency.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { getSortState, setSortState }: SortableProps = $props();
</script>

<style lang="scss">
    td {
        --width: 2rem;

        word-spacing: -0.2ch;
    }
</style>

{#each settingsState.activeView.homeCurrencies as currencyId (currencyId)}
    {@const currencyIdString = currencyId.toString()}
    <td
        class="sortable sorted-{getSortState(currencyIdString)}"
        onclick={() => setSortState(currencyIdString)}
        use:componentTooltip={{
            component: Tooltip,
            propsFunc: () => ({
                currency: wowthingData.static.currencyById.get(currencyId),
                item: wowthingData.items.items[currencyId - 1000000],
            }),
        }}
    >
        {#if currencyId > 1000000}
            <WowthingImage name="item/{currencyId - 1000000}" size={16} border={1} />
        {:else}
            <WowthingImage name="currency/{currencyId}" size={16} border={1} />
        {/if}
    </td>
{/each}
