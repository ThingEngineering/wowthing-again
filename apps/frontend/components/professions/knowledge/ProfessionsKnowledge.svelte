<script lang="ts">
    import some from 'lodash/some'

    import { dragonflightKnowledge, dragonflightProfessions } from '@/data/professions'
    import type { Character } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import Row from './ProfessionsKnowledgeTableRow.svelte'
    import RowProfessions from '@/components/home/table/row/HomeTableRowProfessions.svelte'

    const filterFunc = (char: Character) => some(dragonflightProfessions, (p) => char.professions?.[p.id])
</script>

<style lang="scss">
    th {
        --image-border-width: 0;

        background: $thing-background;
        border: 1px solid $border-color;
    }
</style>

<CharacterTable {filterFunc}>
    <CharacterTableHead slot="head">
        <th></th>
        <th class="spacer"></th>
        {#each dragonflightKnowledge as dk}
            {#if dk === null}
                <th class="spacer"></th>
            {:else}
                <th>{dk.shortName}</th>
            {/if}
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        <RowProfessions {character} />
        <Row {character} />
    </svelte:fragment>
</CharacterTable>
