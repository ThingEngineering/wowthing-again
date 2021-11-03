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

    let categories: StaticDataProgressCategory[]
    $: {
        categories = find($staticStore.data.progress, (p) => p !== null && p[0].slug === slug)
        console.log(categories)
    }
</script>

<style lang="scss">

</style>

<CharacterTable>
    <CharacterTableHead slot="head">
        {#key slug}
            {#if slug === 'shadowlands'}
                <th></th>
            {/if}
            {#each categories as category}
                {#each category.groups as group}
                    <HeadProgress {group} />
                {/each}
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key slug}
            {#if slug === 'shadowlands'}
                <RowCovenant {character} />
            {/if}
            {#each categories as category}
                {#each category.groups as group}
                    <RowProgress {character} {group} />
                {/each}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
