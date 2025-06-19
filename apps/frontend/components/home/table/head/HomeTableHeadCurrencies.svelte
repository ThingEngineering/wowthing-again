<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { wowthingData } from '@/shared/stores/data';
    import { homeState } from '@/stores/local-storage';

    import Tooltip from '@/components/tooltips/currency/TooltipCurrency.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { sortKey }: { sortKey: string } = $props();

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
    }
</script>

<style lang="scss">
    td {
        @include cell-width(2rem);

        word-spacing: -0.2ch;
    }
</style>

{#each settingsState.activeView.homeCurrencies as currencyId (currencyId)}
    {@const sortField = `currency:${currencyId}`}
    <td
        class="sortable"
        class:sorted-by={$homeState.groupSort[sortKey] === sortField}
        onclick={() => setSorting(sortField)}
        onkeypress={() => setSorting(sortField)}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                currency: wowthingData.static.currencyById.get(currencyId),
                item: wowthingData.items.items[currencyId - 1000000],
            },
        }}
    >
        {#if currencyId > 1000000}
            <WowthingImage name="item/{currencyId - 1000000}" size={16} border={1} />
        {:else}
            <WowthingImage name="currency/{currencyId}" size={16} border={1} />
        {/if}
    </td>
{/each}
