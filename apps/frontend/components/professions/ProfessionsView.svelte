<script lang="ts">
    import find from 'lodash/find'

    import { expansionReverseOrder } from '@/data/expansion'
    import { staticStore } from '@/stores'
    import type { Character } from '@/types'
    import type { StaticDataProfession, StaticDataSubProfession } from '@/types/data/static'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte'
    import Profession from './ProfessionsTableProfession.svelte'

    export let slug: string

    let filterFunc: (char: Character) => boolean
    let profession: StaticDataProfession
    let subProfessions: StaticDataSubProfession[]
    $: {
        profession = find(
            Object.values($staticStore.data.professions),
            (prof) => prof.slug === slug
        )
        
        if (profession) {
            filterFunc = (char) => !!char.professions?.[profession.id]
            subProfessions = profession.subProfessions.slice().reverse()
        }
        else {
            filterFunc = () => false
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width(4.5rem);
        
        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if profession}
    <CharacterTable
        {filterFunc}
    >
        <CharacterTableHead slot="head">
            {#each expansionReverseOrder as expansion}
                <td>{expansion.shortName}</td>
            {/each}
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            {#each subProfessions as subProfession}
                <Profession
                    primaryId={profession.id}
                    subId={subProfession.id}
                    {character}
                />
            {/each}
        </svelte:fragment>
    </CharacterTable>
{/if}
