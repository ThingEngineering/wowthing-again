<script lang="ts">
    import { Constants } from '@/data/constants';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { timeStore } from '@/shared/stores/time';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { CharacterProps } from '@/types/props';
    import { currencyGood } from '@/data/currencies';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --max-width: 4rem;
        --width: 2rem;

        border-left: 1px solid var(--border-color);
        text-align: right;
    }
    .got-none {
        color: #999;
    }
</style>

{#each settingsState.activeView.homeCurrencies as currencyId (currencyId)}
    {@const currency =
        currencyId < 1000000 ? wowthingData.static.currencyById.get(currencyId) : undefined}
    {@const itemId = currencyId > 1000000 ? currencyId - 1000000 : 0}
    {@const { amount, amountRaw, percent, tooltip } = getCurrencyData(
        $timeStore,
        character,
        currency,
        itemId
    )}
    {#if amount}
        {@const good = currencyGood[currencyId]}
        <td
            class="max-width"
            class:status-success={good && amountRaw >= good}
            class:status-shrug={percent >= 50 && percent < 100}
            class:status-fail={percent >= 100}
            class:got-none={amount === '0' && percent === 0}
            data-tooltip={tooltip}
        >
            {amount}
        </td>
    {:else}
        <td>&nbsp;</td>
    {/if}
{/each}
