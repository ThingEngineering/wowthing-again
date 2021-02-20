<script lang="ts">
    import CharacterRowCovenant from './table/CharacterRowCovenant.svelte'
    import CharacterRowItemLevel from '../common/CharacterRowItemLevel.svelte'
    import CharacterTable from '../common/CharacterTable.svelte'
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
