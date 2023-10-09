<script lang="ts">
    import some from 'lodash/some'

    import { dragonflightKnowledge, dragonflightProfessions } from '@/data/professions'
    import tippy from '@/utils/tippy'
    import type { Character } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import Row from './ProfessionsKnowledgeTableRow.svelte'
    import RowProfessions from '@/components/home/table/row/HomeTableRowProfessions.svelte'
    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'

    const filterFunc = (char: Character) => some(dragonflightProfessions, (p) => char.professions?.[p.id])
</script>

<style lang="scss">
    .zone {
        @include cell-width($width-mplus-dungeon);

        --image-border-radius: #{$border-radius};
        --image-border-width: 2px;

        background: $thing-background;
        border: 1px solid $border-color;
        padding-bottom: 0.3rem;
        padding-top: 0.3rem;
        position: relative;

        span {
            bottom: calc(0.3rem + 1px);
        }
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
                <th
                    class="zone"
                    use:tippy={dk.name}
                >
                    <WowthingImage name={dk.icon} size={48} />
                    <span class="pill abs-center">{dk.shortName}</span>
                </th>
            {/if}
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        <RowProfessions {character} />
        <Row {character} />
    </svelte:fragment>
</CharacterTable>
