<script lang="ts">
    import find from 'lodash/find'

    import { staticStore } from '@/stores/static'
    import type {StaticDataReputationCategory} from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import TableHead from './ReputationsTableHead.svelte'
    import TableRow from './ReputationsTableRow.svelte'

    export let slug: string

    let category: StaticDataReputationCategory
    $: {
        category = find($staticStore.data.reputationSets, (r) => r?.slug === slug)
    }
</script>

<CharacterTable>
    <CharacterTableHead slot="head">
        {#key category.name}
            {#each category.reputations as reputationSet}
                {#each reputationSet as reputation}
                    <TableHead {reputation} />
                {/each}
            {/each}
        {/key}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {#key category.name}
            {#each category.reputations as reputationSet, reputationSetIndex}
                {#each reputationSet as reputation}
                    <TableRow
                        {character}
                        {reputation}
                        alt={reputationSetIndex % 2 === 1}
                    />
                {/each}
            {/each}
        {/key}
    </svelte:fragment>
</CharacterTable>
