<script lang="ts">
    import filter from 'lodash/filter'
    import findKey from 'lodash/findKey'
    import sortBy from 'lodash/sortBy'

    import {skipCurrencies} from '@/data/currencies'
    import { staticStore } from '@/stores/static'
    import type {StaticDataCurrency} from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadCurrency from './CurrenciesTableHead.svelte'
    import RowCurrency from './CurrenciesTableBody.svelte'

    export let slug: string

    let currencies: StaticDataCurrency[]
    $: {
        const categoryId = parseInt(findKey($staticStore.data.currencyCategories, (c) => c.slug === slug))
        currencies = sortBy(filter($staticStore.data.currencies, (c) => !skipCurrencies[c.id] && c.categoryId === categoryId), (c) => c.name)
    }
</script>

<CharacterTable>
    <CharacterTableHead slot="head">
        {#key slug}
            {#each currencies as currency}
                <HeadCurrency {currency} />
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#each currencies as currency}
                <RowCurrency {character} {currency} />
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
