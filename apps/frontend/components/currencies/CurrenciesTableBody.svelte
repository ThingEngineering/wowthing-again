<script lang="ts">
    import { itemStore } from '@/stores'
    import tippy from '@/utils/tippy'
    import { toNiceNumber } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { StaticDataCurrency } from '@/types/data/static'

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
            const characterItemCount = character.currencyItems?.[itemId] || 0
            const name = $itemStore.items[itemId]?.name || `Item #${itemId}`
            
            amount = toNiceNumber(characterItemCount)
            tooltip = `${characterItemCount.toLocaleString()} ${name}`

            // TODO remove this once unique count is in item data
            if (itemId === 201836) {
                per = characterItemCount / 12 * 100
                tooltip = tooltip.replace(' ', ` / ${12} `)
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-currency);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if amount}
    <td
        class:alt={sortingBy}
        class:status-shrug={per > 50}
        class:status-fail={per > 90}
        use:tippy={tooltip}
    >{amount}</td>
{:else}
    <td>&nbsp;</td>
{/if}
