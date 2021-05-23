<script lang="ts">
    import CharacterRowCovenant from './table/TableRowCovenant.svelte'
    import CharacterRowItemLevel from '../common/character-table/row/ItemLevel.svelte'
    import CharacterTable from '../common/character-table/Table.svelte'
    import CharacterTableHead from '../common/CharacterTableHead.svelte'
</script>

<CharacterTable>
    <slot slot="head">
        <CharacterTableHead />
    </slot>
    <slot slot="rowExtra">
        <CharacterRowItemLevel />
        <CharacterRowCovenant />
    </slot>
</CharacterTable>
