<script lang="ts">
    import { Constants } from '@/data/constants'
    import { gearState } from '@/stores/local-storage'
    import type { Character } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import Options from './GearOptions.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './GearTableRowItems.svelte'

    let filterFunc: (char: Character) => boolean
    $: {
        filterFunc = (char) => (
            ($gearState.showMaxLevel && char.level === Constants.characterMaxLevel) ||
            ($gearState.showOtherLevel && char.level < Constants.characterMaxLevel)
        )
    }
</script>

<style lang="scss">
    div {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>

<CharacterTable
    skipIgnored={true}
    {filterFunc}
>
    <div slot="preTable">
        <Options />
    </div>

    <svelte:fragment slot="rowExtra" let:character>
        <RowItemLevel />
        <RowItems {character} />
    </svelte:fragment>
</CharacterTable>
