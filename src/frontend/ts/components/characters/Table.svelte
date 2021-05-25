<script lang="ts">
    import CharacterTable from '../common/character-table/Table.svelte'
    import Head from '../common/character-table/Head.svelte'
    import RowCovenant from './table/TableRowCovenant.svelte'
    import RowItemLevel from '../common/character-table/row/ItemLevel.svelte'
    import RowKeystone from './table/TableRowKeystone.svelte'
</script>

<CharacterTable>
    <slot slot="head">
        <Head />
    </slot>
    <slot slot="rowExtra">
        <RowItemLevel />
        <RowCovenant />
        <RowKeystone />
    </slot>
</CharacterTable>
