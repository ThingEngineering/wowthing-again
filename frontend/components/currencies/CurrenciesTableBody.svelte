<script lang="ts">
    import type {Character, CharacterCurrency, StaticDataCurrency} from '@/types'
    import tippy from '@/utils/tippy'
    import toNiceNumber from '@/utils/to-nice-number'

    export let character: Character
    export let currency: StaticDataCurrency

    const characterCurrency: CharacterCurrency = character.currencies?.[currency.id]
    let amount = ''
    let tooltip = ''
    if (characterCurrency) {
        amount = toNiceNumber(characterCurrency.total)

        if (characterCurrency.totalMax > 0) {
            tooltip = `${characterCurrency.total.toLocaleString()} / ${characterCurrency.totalMax.toLocaleString()}`
        }
        else {
            tooltip = characterCurrency.total.toLocaleString()
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
    <td use:tippy={tooltip}>{amount}</td>
{:else}
    <td>&nbsp;</td>
{/if}
