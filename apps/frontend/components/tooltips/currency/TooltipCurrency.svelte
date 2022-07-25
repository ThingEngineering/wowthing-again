<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm'
    import leftPad from '@/utils/left-pad'
    import type { Character } from '@/types'
    import type { ManualDataSharedItem } from '@/types/data/manual'
    import type { StaticDataCurrency } from '@/types/data/static'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let currency: StaticDataCurrency
    export let item: ManualDataSharedItem

    let currencies: [Character, number][]
    $: {
        currencies = []
        for (const character of $userStore.data.characters) {
            if ($settings.characters.hiddenCharacters.indexOf(character.id) >= 0) {
                continue
            }

            let quantity = 0
            if (currency) {
                quantity = character.currencies?.[currency.id]?.quantity || 0
            }
            else if (item) {
                quantity = character.currencyItems[item.id] || 0
            }
            else {
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
        {#if currency}
            <WowthingImage
                name="currency/{currency.id}"
                size={20}
                border={1}
            />
            {currency.name}
        {:else if item}
            <WowthingImage
                name="item/{item.id}"
                size={20}
                border={1}
            />
            {item.name}
        {:else}
            <WowthingImage
                name="currency/0"
                size={20}
                border={1}
            />
            Gold
        {/if}
    </h4>

    {#if currencies.length > 0}
        <table class="table-striped">
            <tbody>
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
            </tbody>
        </table>
    {/if}
</div>
