<script lang="ts">
    import filter from 'lodash/filter'
    import findKey from 'lodash/findKey'
    import sortBy from 'lodash/sortBy'

    import {skipCurrencies} from '@/data/currencies'
    import { data as staticData } from '@/stores/static'
    import type {StaticDataCurrency} from '@/types'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import Head from '@/components/character-table/Head.svelte'
    import HeadCurrency from './TableHeadCurrency.svelte'
    import RowCurrency from './TableRowCurrency.svelte'

    export let slug: string

    let currencies: StaticDataCurrency[]
    $: {
        const categoryId = parseInt(findKey($staticData.currencyCategories, (c) => c.slug === slug))
        currencies = sortBy(filter($staticData.currencies, (c) => !skipCurrencies[c.id] && c.categoryId === categoryId), (c) => c.name)
    }
</script>

<CharacterTable endSpacer={false}>
    <Head slot="head">
        {#key slug}
            {#each currencies as currency}
                <HeadCurrency {currency} />
            {/each}
        {/key}
    </Head>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#each currencies as currency}
                <RowCurrency {character} {currency} />
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
