<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { professionSlugToId } from '@/data/professions'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { Character } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import Row from './TableRow.svelte'
    import Sidebar from './Sidebar.svelte'

    export let slug: string

    let professionId: number
    $: {
        professionId = professionSlugToId[slug]
    }

    $: filterFunc = (char: Character): boolean => {
        return slug === 'all'
            ? true
            : !!char.professions?.[professionId]
    }

    afterUpdate(() => getSavedRoute('professions/equipment', slug))
</script>

<Sidebar />

{#if slug === 'all' || professionId}
    <CharacterTable
        {filterFunc}
        skipIgnored={true}
    >
        <svelte:fragment slot="rowExtra" let:character>
            <Row {character} {professionId} />
        </svelte:fragment>
    </CharacterTable>
{/if}
