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
        --image-border-width: 2px;
        --padding-left: 0;
        --padding-right: 0;
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
            {@const itemId = currencyId - 1000000}
            {@const item = wowthingData.items.items[itemId]}
            <WowthingImage
                name="item/{itemId}"
                size={16}
                border={2}
                cls="quality{item?.quality || 1}-border"
            />
        {:else}
            <WowthingImage name="currency/{currencyId}" size={16} border={2} />
        {/if}
    </td>
{/each}
