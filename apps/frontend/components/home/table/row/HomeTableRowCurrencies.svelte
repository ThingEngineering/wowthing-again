<script lang="ts">
    import { activeView } from '@/shared/stores/settings'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character } from '@/types'

    export let character: Character

    const getCurrencyPercent = (currencyId: number): number => {
        const characterCurrency = character.currencies?.[currencyId]
        let per = -1
        if (characterCurrency) {
            if (characterCurrency.isMovingMax && characterCurrency.max > 0) {
                per = characterCurrency.totalQuantity / characterCurrency.max * 100
            }
            else {
                if (characterCurrency.max > 0) {
                    per = characterCurrency.quantity / characterCurrency.max * 100
                }
            }
        }
        return per
    }
</script>

<style lang="scss">
    td {
        @include cell-width(2rem);

        border-left: 1px solid $border-color;
        text-align: right;
    }
</style>

{#each $activeView.homeCurrencies as currencyId}
    {@const per = getCurrencyPercent(currencyId)}
    <td
        class:status-fail={per === 100}
        class:status-shrug={per >= 75 && per < 100}
    >
        {#if currencyId > 1000000}
            {@const itemId = currencyId - 1000000}
            {character.itemCounts[itemId]}
        {:else}
            {toNiceNumber(character.currencies[currencyId]?.quantity || 0)}
        {/if}
    </td>
{/each}
