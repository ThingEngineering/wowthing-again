<script lang="ts">
    import { Constants } from '@/data/constants';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { staticStore } from '@/shared/stores/static';
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { Character } from '@/types';

    export let character: Character;
</script>

<style lang="scss">
    td {
        @include cell-width(2rem, $maxWidth: 4rem);

        border-left: 1px solid $border-color;
        text-align: right;
    }
    .faded {
        color: #aaa;
    }
</style>

{#each settingsState.activeView.homeCurrencies as currencyId (currencyId)}
    {@const currency = currencyId < 1000000 ? $staticStore.currencies[currencyId] : undefined}
    {@const itemId = currencyId > 1000000 ? currencyId - 1000000 : 0}
    {@const { amount, amountRaw, percent, tooltip } = getCurrencyData(
        $timeStore,
        userStore,
        character,
        currency,
        itemId
    )}
    {#if amount}
        <td
            class:status-success={currency?.id === Constants.currencies.honor && amountRaw >= 2000}
            class:status-shrug={percent >= 50 && percent < 100}
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
{/each}
