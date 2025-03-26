<script lang="ts">
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { itemStore, userStore } from '@/stores';
    import { getCurrencyData } from '@/utils/characters/get-currency-data';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';
    import type { Character } from '@/types/character';

    export let character: Character;
    export let currency: StaticDataCurrency = undefined;
    export let itemId = 0;
    export let sortingBy: boolean;

    $: ({ amount, percent, tooltip } = getCurrencyData(
        $itemStore,
        $timeStore,
        userStore,
        character,
        currency,
        itemId,
    ));
</script>

<style lang="scss">
    td {
        @include cell-width($width-currency, $maxWidth: $width-currency-max);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .faded {
        color: #aaa;
    }
</style>

{#if amount}
    <td
        class:alt={sortingBy}
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
