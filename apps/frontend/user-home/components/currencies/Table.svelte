<script lang="ts">
    import find from 'lodash/find'
    import sortBy from 'lodash/sortBy'

    import { categoryChildren, currencyExtra, currencyItems, skipCurrenciesMap } from '@/data/currencies'
    import { settingsStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { currencyState } from '@/stores/local-storage'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import { leftPad } from '@/utils/formatting'
    import type { Character, MultiSlugParams } from '@/types'
    import type { StaticDataCurrency, StaticDataCurrencyCategory } from '@/shared/stores/static/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadCurrency from './TableHead.svelte'
    import RowCurrency from './TableRow.svelte'

    export let params: MultiSlugParams

    let category: StaticDataCurrencyCategory
    let currencies: StaticDataCurrency[]
    let slugKey: string
    let sorted: boolean
    let sortFunc: (char: Character) => string
    $: {
        category = find($staticStore.currencyCategories, (cat) => cat.slug === params.slug1)
        if (params.slug2) {
            category = find(categoryChildren[category.id], (cat) => cat.slug === params.slug2)
        }

        if (!category) {
            break $
        }

        slugKey = params.slug2 ? `${params.slug1}--${params.slug2}` : params.slug1

        currencies = sortBy(
            Object.values($staticStore.currencies)
                .filter((c) => !skipCurrenciesMap[c.id] && c.categoryId === category.id)
                .concat(
                    (currencyExtra[category.id] || [])
                        .map((id) => $staticStore.currencies[id])
                ),
            (c) => c.name
        )

        const order = $currencyState.sortOrder[slugKey]
        if (order > 0) {
            sorted = true
            sortFunc = getCharacterSortFunc($settingsStore, $staticStore, (char) => leftPad(1000000 - (
                char.getItemCount(order) ||
                char.currencies?.[order]?.quantity ||
                -1
            ), 7, '0'))
        }
        else {
            sorted = false
            sortFunc = getCharacterSortFunc($settingsStore, $staticStore)
        }
    }
</script>

{#if category}
    <CharacterTable
        skipGrouping={sorted}
        {sortFunc}
    >
        <CharacterTableHead slot="head">
            <th class="spacer"></th>
            {#key slugKey}
                {#each currencies as currency}
                    <HeadCurrency
                        slug={slugKey}
                        sortingBy={$currencyState.sortOrder[slugKey] === currency.id}
                        {currency}
                    />
                {/each}

                {#if currencyItems[category.id]}
                    {#if currencies.length > 0}
                        <th class="spacer"></th>
                    {/if}

                    {#each currencyItems[category.id] as itemId}
                        {#if itemId === null}
                            <th class="spacer"></th>
                        {:else}
                            <HeadCurrency
                                slug={slugKey}
                                sortingBy={$currencyState.sortOrder[slugKey] === itemId}
                                {itemId}
                            />
                        {/if}
                    {/each}
                {/if}
            {/key}
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            <td class="spacer"></td>
            {#key slugKey}
                {#each currencies as currency}
                    <RowCurrency
                        sortingBy={$currencyState.sortOrder[slugKey] === currency.id}
                        {character}
                        {currency}
                    />
                {/each}

                {#if currencyItems[category.id]}
                    {#if currencies.length > 0}
                        <td class="spacer"></td>
                    {/if}

                    {#each currencyItems[category.id] as itemId}
                        {#if itemId === null}
                            <td class="spacer"></td>
                        {:else}
                            <RowCurrency
                                sortingBy={$currencyState.sortOrder[slugKey] === itemId}
                                {character}
                                {itemId}
                            />
                        {/if}
                    {/each}
                {/if}
            {/key}
        </svelte:fragment>
    </CharacterTable>
{/if}
