<script lang="ts">
    import filter from 'lodash/filter'
    import findKey from 'lodash/findKey'
    import sortBy from 'lodash/sortBy'

    import { skipCurrenciesMap } from '@/data/currencies'
    import { currencyState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import { staticStore } from '@/stores/static'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import toDigits from '@/utils/to-digits'
    import type { Character, StaticDataCurrency } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadCurrency from './CurrenciesTableHead.svelte'
    import RowCurrency from './CurrenciesTableBody.svelte'

    export let slug: string

    let currencies: StaticDataCurrency[]
    let sorted: boolean
    let sortFunc: (char: Character) => string
    $: {
        const categoryId = parseInt(findKey($staticStore.data.currencyCategories, (c) => c.slug === slug))
        currencies = sortBy(filter($staticStore.data.currencies, (c) => !skipCurrenciesMap[c.id] && c.categoryId === categoryId), (c) => c.name)

        const order = $currencyState.sortOrder[slug]
        if (order > 0) {
            sorted = true
            sortFunc = (char) => toDigits(1000000 - (char.currencies?.[order]?.quantity ?? -1), 7)
        }
        else {
            sorted = false
            sortFunc = getCharacterSortFunc($settingsData)
        }
    }
</script>

<CharacterTable
    skipGrouping={sorted}
    {sortFunc}
>
    <CharacterTableHead slot="head">
        {#key slug}
            {#each currencies as currency}
                <HeadCurrency
                    sortingBy={$currencyState.sortOrder[slug] === currency.id}
                    {slug}
                    {currency}
                />
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#each currencies as currency}
                <RowCurrency
                    sortingBy={$currencyState.sortOrder[slug] === currency.id}
                    {character}
                    {currency}
                />
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
