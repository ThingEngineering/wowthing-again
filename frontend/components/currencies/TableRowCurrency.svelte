<script lang="ts">
    import type {Character, CharacterCurrency, StaticDataCurrency} from '@/types'
    import tippy from '@/utils/tippy'

    export let character: Character
    export let currency: StaticDataCurrency

    const characterCurrency: CharacterCurrency = character.currencies?.[currency.id]
    let amount = ''
    let tooltip = ''
    if (characterCurrency) {
        if (characterCurrency.total >= 10000) {
            // 25976 -> 259.76 (divide by 100) -> 259 (floor) -> 25.9 (divide by 10) -> 25.9k
            amount = `${(Math.floor(characterCurrency.total / 100) / 10).toFixed(1).toLocaleString()}k`
        }
        else {
            amount = characterCurrency.total.toLocaleString()
        }

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
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if characterCurrency}
    <td use:tippy={tooltip}>{amount}</td>
{:else}
    <td>&nbsp;</td>
{/if}
