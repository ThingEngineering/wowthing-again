<script lang="ts">
    import { currencyItemCurrencies } from '@/data/currencies'
    import { itemStore, timeStore, userStore } from '@/stores'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { StaticDataCurrency } from '@/shared/stores/static/types'

    export let character: Character
    export let currency: StaticDataCurrency = undefined
    export let itemId = 0
    export let sortingBy: boolean

    let amount = ''
    let per: number
    let tooltip = ''
    $: {
        if (currency) {
            const characterCurrency = character.currencies?.[currency.id]
            if (characterCurrency) {
                amount = toNiceNumber(characterCurrency.quantity)

                if (characterCurrency.isMovingMax && characterCurrency.max > 0) {
                    per = characterCurrency.totalQuantity / characterCurrency.max * 100
                    tooltip = `${characterCurrency.totalQuantity.toLocaleString()} / ${characterCurrency.max.toLocaleString()}`
                }
                else {
                    if (characterCurrency.max > 0) {
                        per = characterCurrency.quantity / characterCurrency.max * 100
                        tooltip = `${characterCurrency.quantity.toLocaleString()} / ${characterCurrency.max.toLocaleString()}`
                    }
                    else {
                        per = 0
                        tooltip = characterCurrency.quantity.toLocaleString()
                    }
                }
                tooltip += ` ${currency.name}`
            }
        }
        else {
            const characterItemCount = character.getItemCount(itemId)
            const name = $itemStore.items[itemId]?.name || `Item #${itemId}`
            
            amount = toNiceNumber(characterItemCount)
            tooltip = `${characterItemCount.toLocaleString()}x ${name}`

            if (currencyItemCurrencies[itemId]) {
                const characterCurrency = character.currencies?.[currencyItemCurrencies[itemId]]
                if (characterCurrency?.max > 0) {
                    per = characterCurrency.quantity / characterCurrency.max * 100
                    tooltip += ` &ndash; ${characterCurrency.quantity} / ${characterCurrency.max}`
                }
            }
            // This has a backing currency which does not have a max, whee
            else if (itemId === 204717) {
                const characterCurrency = character.currencies?.[2413]
                const quantity = characterCurrency?.quantity || 0
                
                const period = userStore.getCurrentPeriodForCharacter($timeStore, character)
                const max = period.id - 904

                per = quantity / max * 100
                tooltip += ` &ndash; ${quantity} / ${max}`
            }
            // TODO remove this once unique count is in item data
            else if (itemId === 201836) {
                per = characterItemCount / 12 * 100
                tooltip = tooltip.replace('x ', ` / ${12} `)
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-currency, $maxWidth: $width-currency-max);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if amount}
    <td
        class:alt={sortingBy}
        class:status-shrug={per > 50}
        class:status-fail={per > 90}
        use:basicTooltip={{
            allowHTML: true,
            content: tooltip
        }}
    >
        {amount}
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
