<script lang="ts">
    import find from 'lodash/find'
    import flatten from 'lodash/flatten'

    import { data as staticData } from '@/stores/static'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import TableHead from './ReputationsTableHead.svelte'
    import TableRow from './ReputationsTableRow.svelte'

    export let slug: string

    $: category = find($staticData.reputationSets, (r) => r.slug === slug)
</script>

<CharacterTable endSpacer={false}>
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
