<script lang="ts">
    import { dragonflightProfessions } from '@/data/professions'
    import type { Character } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import CharacterKnowledge from './CharacterKnowledge.svelte';

    const filterFunc = (char: Character) => dragonflightProfessions.some((p) => char.professions?.[p.id])
</script>

<style lang="scss">
    .expansion {
        border-left: 1px solid $border-color;
        padding: 0.2rem 0.3rem;
    }
</style>

<CharacterTable {filterFunc}>
    <CharacterTableHead slot="head">
        <th class="spacer"></th>
        <th class="expansion" colspan="2">Dragonflight</th>
        <th class="spacer"></th>
        <th class="expansion" colspan="2">The War Within</th>
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        <td class="spacer"></td>
        <CharacterKnowledge {character} expansionSlug={'dragonflight'} profession={0} />
        <CharacterKnowledge {character} expansionSlug={'dragonflight'} profession={1} />
        <td class="spacer"></td>
        <CharacterKnowledge {character} expansionSlug={'war-within'} profession={0} />
        <CharacterKnowledge {character} expansionSlug={'war-within'} profession={1} />
    </svelte:fragment>
</CharacterTable>
