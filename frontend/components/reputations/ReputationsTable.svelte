<script lang="ts">
    import find from 'lodash/find'
    import flatten from 'lodash/flatten'

    import { staticStore } from '@/stores/static'
    import type { StaticDataReputationCategory } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import TableHead from './ReputationsTableHead.svelte'
    import TableRow from './ReputationsTableRow.svelte'

    export let slug: string

    let category: StaticDataReputationCategory
    $: {
        category = find($staticStore.data.reputationSets, (r) => r.slug === slug)
    }
</script>

<CharacterTable>
    <CharacterTableHead slot="head">
        {#key category.name}
            {#each flatten(category.reputations) as reputation}
                <TableHead {reputation} />
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra">
        {#key category.name}
            {#each flatten(category.reputations) as reputation}
                <TableRow {reputation} />
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
