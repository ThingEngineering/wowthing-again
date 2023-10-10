<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { settingsStore, userStore } from '@/stores'
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm'
    import { getFilteredCharacters } from '@/utils/get-filtered-characters'
    import { leftPad } from '@/utils/formatting'
    import type { Character } from '@/types'
    import type { ItemDataItem } from '@/types/data/item'
    import type { StaticDataCurrency } from '@/stores/static/types'

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let currency: StaticDataCurrency
    export let item: ItemDataItem

    let currencies: [Character, number][]
    let currencyName: string
    let iconName: string
    $: {
        currencies = []
        for (const character of getFilteredCharacters($settingsStore, $userStore)) {
            let quantity = 0
            if (currency) {
                currencyName = currency.name
                iconName = `currency/${currency.id}`
                quantity = character.currencies?.[currency.id]?.quantity || 0
            }
            else if (item) {
                currencyName = item.name
                iconName = `item/${item.id}`
                quantity = character.getItemCount(item.id)
            }
            else {
                currencyName = 'Gold'
                iconName = 'currency/0'
                quantity = character.gold || 0
            }

            if (quantity > 0) {
                currencies.push([character, quantity])
            }
        }

        currencies = sortBy(
            currencies,
            ([, amount]) => leftPad(10_000_000 - amount, 8, '0')
        )
    }
</script>

<style lang="scss">
    h4 {
        --image-border-width: 1px;
    }
    table {
        --padding: 2;
    }
    .name {
        @include cell-width(3rem, $maxWidth: 10rem);
        
        text-align: left;
        white-space: nowrap;
    }
    .amount {
        @include cell-width(4rem);

        text-align: right;
        white-space: nowrap;
    }
</style>

<div class="wowthing-tooltip">
    <h4>
        <WowthingImage
            name={iconName}
            size={20}
            border={1}
        />
        {currencyName}
    </h4>

    <table class="table-striped">
        <tbody>
            {#if currencies.length > 0}
                {#each currencies.slice(0, 10) as [character, amount]}
                    <tr>
                        <td class="name">{getCharacterNameRealm(character.id)}</td>
                        <td class="amount">{amount.toLocaleString()}</td>
                    </tr>
                {/each}

                {#if currencies.length > 10}
                    <tr>
                        <td colspan="2">... and {currencies.length - 10} more</td>
                    </tr>
                {/if}
            {:else}
                <tr>
                    <td>No character has this currency!</td>
                </tr>
            {/if}
        </tbody>
    </table>
        
    {#if currencies.length > 0}
        <div class="bottom">
            Total:
            <WowthingImage
                name={iconName}
                size={20}
                border={1}
            />
            {currencies.reduce((a, b) => a + b[1], 0).toLocaleString()}
        </div>
    {/if}
</div>
