<script lang="ts">
    import { Constants } from '@/data/constants';
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';
    import type { Character } from '@/types/character';

    export let character: Character;
    export let currency: StaticDataCurrency = undefined;
    export let itemId = 0;
    export let sortingBy: boolean;

    $: ({ amount, amountRaw, percent, tooltip } = getCurrencyData(
        $timeStore,
        character,
        currency,
        itemId
    ));
</script>

<style lang="scss">
    td {
        --width: var(--width-currency);
        --width-max: var(--width-currency-max);

        border-left: 1px solid var(--border-color);
        text-align: center;
    }
    .faded {
        color: #aaa;
    }
</style>

{#if amount}
    <td
        class:alt={sortingBy}
        class:status-success={currency?.id === Constants.currencies.honor && amountRaw >= 2000}
        class:status-shrug={percent > 50}
        class:status-warn={percent >= 90}
        class:status-fail={percent >= 100}
        class:faded={amount === '0' && percent === 0}
        use:basicTooltip={{
            allowHTML: true,
            content: tooltip,
        }}
    >
        {amount}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
