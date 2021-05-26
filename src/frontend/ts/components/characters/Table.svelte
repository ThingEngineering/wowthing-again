<script lang="ts">
    import CharacterTable from '../common/character-table/Table.svelte'
    import Head from '../common/character-table/Head.svelte'
    import RowCovenant from './table/TableRowCovenant.svelte'
    import RowItemLevel from '../common/character-table/row/ItemLevel.svelte'
    import RowKeystone from '../common/character-table/row/Keystone.svelte'
    import RowVault from './table/TableRowVault.svelte'
</script>

<CharacterTable>
    <slot slot="head">
        <Head />
    </slot>
    <slot slot="rowExtra">
        <RowItemLevel />
        <RowCovenant />
        <RowKeystone />
        <RowVault />
    </slot>
</CharacterTable>
