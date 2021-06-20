<script lang="ts">
    import { data as settings } from '@/stores/settings'
    import { data as userData } from '@/stores/user'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import GroupHead from './table/GroupHead.svelte'
    import RowCovenant from './table/RowCovenant.svelte'
    import RowGold from '@/components/character-table/row/Gold.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowMountSpeed from './table/RowMountSpeed.svelte'
    import RowStatuses from './table/RowStatuses.svelte'
    import RowUghQuests from './table/RowUghQuests.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'
</script>

<CharacterTable let:group let:groupIndex let:character>
    <slot slot="groupHead">
        <GroupHead {group} {groupIndex} />
    </slot>

    <slot slot="rowExtra">
        {#if $userData.public === false}
            <RowGold gold={character.gold} />
        {/if}

        {#if $settings.general.showItemLevel}
            <RowItemLevel />
        {/if}

        {#if $settings.home.showMountSpeed}
            <RowMountSpeed />
        {/if}

        {#if $settings.home.showCovenant}
            <RowCovenant />
        {/if}

        {#if $userData.public === false}
            <RowUghQuests />
        {/if}

        {#if $settings.home.showKeystone}
            <RowKeystone />
        {/if}

        {#if $settings.home.showVaultMythicPlus}
            <RowVaultMythicPlus {character} />
        {/if}

        {#if $settings.home.showStatuses && $userData.public === false}
            <RowStatuses />
        {/if}
    </slot>
</CharacterTable>
