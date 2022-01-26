<script lang="ts">
    import tippy from '@/utils/tippy'
    import { toNiceNumber } from '@/utils/to-nice'
    import type { Character, CharacterCurrency } from '@/types'
    import type { StaticDataCurrency } from '@/types/data/static'

    export let character: Character
    export let currency: StaticDataCurrency
    export let sortingBy: boolean

    const characterCurrency: CharacterCurrency = character.currencies?.[currency.id]
    let amount = ''
    let per: number
    let tooltip = ''
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
</script>

<style lang="scss">
    td {
        @include cell-width($width-currency);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if characterCurrency}
    <td
        class:alt={sortingBy}
        class:status-shrug={per > 50}
        class:status-fail={per > 90}
        use:tippy={tooltip}
    >{amount}</td>
{:else}
    <td>&nbsp;</td>
{/if}
