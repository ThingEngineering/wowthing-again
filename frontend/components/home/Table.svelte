<script lang="ts">
    import { data as settings } from '@/stores/settings'
    import { data as userData } from '@/stores/user'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import RowCovenant from './table/RowCovenant.svelte'
    import RowGold from './table/RowGold.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowMountSkill from './table/RowMountSkill.svelte'
    import RowStatuses from './table/RowStatuses.svelte'
    import RowUghQuests from './table/RowUghQuests.svelte'
    import RowVault from './table/RowVault.svelte'
</script>

<CharacterTable>
    <slot slot="rowExtra">
        {#if $userData.public === false}
            <RowGold />
        {/if}
        {#if $settings.general.showItemLevel}
            <RowItemLevel />
        {/if}
        {#if $settings.home.showMountSkill}
            <RowMountSkill />
        {/if}
        {#if $settings.home.showCovenant}
            <RowCovenant />
        {/if}
        <RowUghQuests />
        {#if $settings.home.showKeystone}
            <RowKeystone />
        {/if}
        {#if $settings.home.showVault}
            <RowVault />
        {/if}
        {#if $settings.home.showStatuses && $userData.public === false}
            <RowStatuses />
        {/if}
    </slot>
</CharacterTable>
