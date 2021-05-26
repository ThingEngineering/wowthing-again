<script lang="ts">
    import CharacterTable from '@/components/common/character-table/Table.svelte'
    import Head from '@/components/common/character-table/Head.svelte'
    import RowCovenant from './table/TableRowCovenant.svelte'
    import RowItemLevel from '@/components/common/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/common/character-table/row/Keystone.svelte'
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
