<script lang="ts">
    import { currencyGood } from '@/data/currencies';
    import { timeState } from '@/shared/state/time.svelte';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & {
        sortingBy: boolean;
        currency?: StaticDataCurrency;
        itemId?: number;
    };
    let { character, sortingBy, currency, itemId }: Props = $props();

    let { amount, amountRaw, percent, tooltip } = $derived(
        getCurrencyData(timeState.slowTime, character, currency, itemId)
    );
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
    {@const good = currencyGood[currency?.id]}
    <td
        class:alt={sortingBy}
        class:status-success={good && amountRaw >= good}
        class:status-shrug={(percent > 50 && percent < 90) || (good && amountRaw >= good * 0.9)}
        class:status-warn={percent >= 90 && percent < 100}
        class:status-fail={percent >= 100}
        class:faded={amount === '0' && percent === 0}
        data-tooltip={tooltip}
    >
        {amount}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
