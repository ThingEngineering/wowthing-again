<script lang="ts">
    import find from 'lodash/find';
    import sortBy from 'lodash/sortBy';

    import {
        categoryChildren,
        currencyExtra,
        currencyItems,
        skipCurrenciesMap,
    } from '@/data/currencies';
    import { wowthingData } from '@/shared/stores/data';
    import { currencyState } from '@/stores/local-storage';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import { leftPad } from '@/utils/formatting';
    import type { Character, MultiSlugParams } from '@/types';
    import type {
        StaticDataCurrency,
        StaticDataCurrencyCategory,
    } from '@/shared/stores/static/types';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import HeadCurrency from './TableHead.svelte';
    import RowCurrency from './TableRow.svelte';

    export let params: MultiSlugParams;

    let category: StaticDataCurrencyCategory;
    let currencies: StaticDataCurrency[];
    let slugKey: string;
    let sorted: boolean;
    let sortFunc: (char: Character) => string;
    $: {
        category = wowthingData.static.currencyCategoryBySlug.get(params.slug1);
        if (params.slug2) {
            category = find(categoryChildren[category.id], (cat) => cat.slug === params.slug2);
        }

        if (!category) {
            break $;
        }

        slugKey = params.slug2 ? `${params.slug1}--${params.slug2}` : params.slug1;

        currencies = sortBy(
            Array.from(wowthingData.static.currencyById.values()).filter(
                (c) => !skipCurrenciesMap[c.id] && c.categoryId === category.id
            ),
            (c) => c.name
        ).concat(
            (currencyExtra[category.id] || []).map((id) => wowthingData.static.currencyById.get(id))
        );

        const order = $currencyState.sortOrder[slugKey];
        if (order > 0) {
            sorted = true;
            sortFunc = $getCharacterSortFunc((char) =>
                leftPad(
                    1000000 -
                        (char.getItemCount(order) || char.currencies?.[order]?.quantity || -1),
                    7,
                    '0'
                )
            );
        } else {
            sorted = false;
            sortFunc = $getCharacterSortFunc();
        }
    }

    const filterFuncUgh = (currencies: StaticDataCurrency[], char: Character): boolean =>
        currencies.some((c) => !!c && char.currencies?.[c.id]?.quantity > 0) ||
        (currencyItems[category.id] || []).some((itemId) => char.getItemCount(itemId) > 0);
</script>

{#if category}
    {@const hasCurrencyItems = !!currencyItems[category.id]}
    <CharacterTable
        filterFunc={(char) => filterFuncUgh(currencies, char)}
        showWarbank={hasCurrencyItems}
        skipGrouping={sorted}
        {sortFunc}
    >
        <CharacterTableHead slot="head">
            {#key slugKey}
                <th class="spacer"></th>
                {#each currencies as currency, currencyIndex (`${slugKey}--${currencyIndex}`)}
                    {#if !currency}
                        <th class="spacer"></th>
                    {:else}
                        <HeadCurrency
                            slug={slugKey}
                            sortingBy={$currencyState.sortOrder[slugKey] === currency.id}
                            {currency}
                        />
                    {/if}
                {/each}

                {#if hasCurrencyItems}
                    {#if currencies.length > 0}
                        <th class="spacer"></th>
                    {/if}

                    {#each currencyItems[category.id] as itemId, itemIndex (`${slugKey}--${itemIndex}`)}
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

        <svelte:fragment slot="warbankExtra">
            {#key slugKey}
                {#if currencies.length > 0}
                    <td class="spacer"></td>
                    <td colspan={currencies.length}></td>
                {/if}

                {#if hasCurrencyItems}
                    <td class="spacer"></td>
                    {#each currencyItems[category.id] as itemId, itemIndex (`${slugKey}--${itemIndex}`)}
                        {#if itemId === null}
                            <td class="spacer"></td>
                        {:else}
                            <RowCurrency
                                sortingBy={$currencyState.sortOrder[slugKey] === itemId}
                                character={null}
                                {itemId}
                            />
                        {/if}
                    {/each}
                {/if}
            {/key}
        </svelte:fragment>

        <svelte:fragment slot="rowExtra" let:character>
            <td class="spacer"></td>
            {#key slugKey}
                {#each currencies as currency (currency)}
                    {#if !currency}
                        <td class="spacer"></td>
                    {:else}
                        <RowCurrency
                            sortingBy={$currencyState.sortOrder[slugKey] === currency.id}
                            {character}
                            {currency}
                        />
                    {/if}
                {/each}

                {#if hasCurrencyItems}
                    {#if currencies.length > 0}
                        <td class="spacer"></td>
                    {/if}

                    {#each currencyItems[category.id] as itemId, itemIndex (`${slugKey}--${itemIndex}`)}
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
