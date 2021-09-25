<script lang="ts">
    import find from 'lodash/find'

    import { staticStore } from '@/stores/static'
    import type { Character, StaticDataProgressCategory } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import HeadProgress from './ProgressTableHead.svelte'
    import RowCovenant from '@/components/home/table/row/HomeTableRowCovenant.svelte'
    import RowProgress from './ProgressTableBody.svelte'

    export let slug: string

    let category: StaticDataProgressCategory
    let filterFunc: (char: Character) => boolean = null

    $: {
        category = find($staticStore.data.progress, (c: StaticDataProgressCategory) => c.slug === slug)
        if (category && slug === 'shadowlands') {
            filterFunc = (c) => c.shadowlands?.covenantId > 0
        }
    }
</script>

<style lang="scss">

</style>

<CharacterTable {filterFunc}>
    <CharacterTableHead slot="head">
        {#key slug}
            {#if slug === 'shadowlands'}
                <th></th>
            {/if}
            {#each category.groups as group}
                <HeadProgress {group} />
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#if slug === 'shadowlands'}
                <RowCovenant {character} />
            {/if}
            {#each category.groups as group}
                <RowProgress {character} {group} />
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
