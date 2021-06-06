<script lang="ts">
    import {data as userData} from '@/stores/user-store'

    import CharacterTable from '@/components/common/character-table/Table.svelte'
    import RowCovenant from './table/RowCovenant.svelte'
    import RowGold from './table/RowGold.svelte'
    import RowItemLevel from '@/components/common/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/common/character-table/row/Keystone.svelte'
    import RowMountSpeed from './table/RowMountSpeed.svelte'
    import RowStatuses from './table/RowStatuses.svelte'
    import RowVault from './table/RowVault.svelte'
</script>

<CharacterTable>
    <slot slot="rowExtra">
        {#if $userData.public === false}
            <RowGold />
        {/if}
        <RowItemLevel />
        {#if $userData.public === false}
            <RowStatuses />
        {/if}
        <RowMountSpeed />
        <RowCovenant />
        <RowKeystone />
        <RowVault />
    </slot>
</CharacterTable>
