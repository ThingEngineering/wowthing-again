<script lang="ts">
    import filter from 'lodash/filter'
    import findKey from 'lodash/findKey'
    import sortBy from 'lodash/sortBy'

    import { currencyItems, skipCurrenciesMap } from '@/data/currencies'
    import { currencyState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import { staticStore } from '@/stores/static'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import leftPad from '@/utils/left-pad'
    import type { Character } from '@/types'
    import type { StaticDataCurrency } from '@/types/data/static'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadCurrency from './CurrenciesTableHead.svelte'
    import RowCurrency from './CurrenciesTableBody.svelte'

    export let slug: string

    let categoryId: number
    let currencies: StaticDataCurrency[]
    let sorted: boolean
    let sortFunc: (char: Character) => string
    $: {
        categoryId = parseInt(findKey($staticStore.data.currencyCategories, (c) => c.slug === slug))
        currencies = sortBy(filter($staticStore.data.currencies, (c) => !skipCurrenciesMap[c.id] && c.categoryId === categoryId), (c) => c.name)

        const order = $currencyState.sortOrder[slug]
        if (order > 0) {
            sorted = true
            sortFunc = (char) => leftPad(1000000 - (
                char.currencyItems?.[order] ??
                char.currencies?.[order]?.quantity ??
                -1
            ), 7, '0')
        }
        else {
            sorted = false
            sortFunc = getCharacterSortFunc($settingsData, $staticStore.data)
        }
    }
</script>

<CharacterTable
    skipGrouping={sorted}
    {sortFunc}
>
    <CharacterTableHead slot="head">
        <th class="spacer"></th>
        {#key slug}
            {#each currencies as currency}
                <HeadCurrency
                    sortingBy={$currencyState.sortOrder[slug] === currency.id}
                    {slug}
                    {currency}
                />
            {/each}

            {#if currencyItems[categoryId]}
                <th class="spacer"></th>
                {#each currencyItems[categoryId] as itemId}
                    <HeadCurrency
                        sortingBy={$currencyState.sortOrder[slug] === itemId}
                        {slug}
                        {itemId}
                    />
                {/each}
            {/if}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        <td class="spacer"></td>
        {#key slug}
            {#each currencies as currency}
                <RowCurrency
                    sortingBy={$currencyState.sortOrder[slug] === currency.id}
                    {character}
                    {currency}
                />
            {/each}

            {#if currencyItems[categoryId]}
                <td class="spacer"></td>
                {#each currencyItems[categoryId] as itemId}
                    <RowCurrency
                        sortingBy={$currencyState.sortOrder[slug] === itemId}
                        {character}
                        {itemId}
                    />
                {/each}
            {/if}
        {/key}
    </svelte:fragment>
</CharacterTable>
