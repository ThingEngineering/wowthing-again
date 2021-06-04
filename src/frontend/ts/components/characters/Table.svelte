<script lang="ts">
    import {data as userData} from '@/stores/user-store'

    import CharacterTable from '@/components/common/character-table/Table.svelte'
    import RowCovenant from './table/TableRowCovenant.svelte'
    import RowGold from './table/TableRowGold.svelte'
    import RowItemLevel from '@/components/common/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/common/character-table/row/Keystone.svelte'
    import RowVault from './table/TableRowVault.svelte'
</script>

<CharacterTable>
    <slot slot="rowExtra">
        {#if $userData.public === false}
            <RowGold />
        {/if}
        <RowItemLevel />
        <RowCovenant />
        <RowKeystone />
        <RowVault />
    </slot>
</CharacterTable>
