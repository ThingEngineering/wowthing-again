<script lang="ts">
    import { data as settings } from '@/stores/settings'
    import userStore from '@/stores/user'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import GroupHead from './table/GroupHead.svelte'
    import RowCovenant from './table/RowCovenant.svelte'
    import RowGold from '@/components/character-table/row/Gold.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowMountSpeed from './table/RowMountSpeed.svelte'
    import RowStatuses from './table/RowStatuses.svelte'
    import RowTorghast from './table/row/Torghast.svelte'
    import RowUghQuests from './table/RowUghQuests.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'
    import RowVaultRaid from '@/components/character-table/row/VaultRaid.svelte'

    let isPublic: boolean
    $: {
        isPublic = $userStore.data.public
    }
</script>

<CharacterTable>
    <GroupHead slot="groupHead" let:group let:groupIndex {group} {groupIndex} />

    <svelte:fragment slot="rowExtra" let:character>
        {#if !isPublic}
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

        {#if !isPublic}
            <RowUghQuests />
        {/if}

        {#if $settings.home.showTorghast}
            <RowTorghast {character} />
        {/if}

        {#if $settings.home.showKeystone}
            <RowKeystone {character} />
        {/if}

        {#if $settings.home.showVaultMythicPlus}
            <RowVaultMythicPlus {character} />
        {/if}

        {#if $settings.home.showVaultRaid}
            <RowVaultRaid {character} />
        {/if}

        {#if $settings.home.showStatuses && !isPublic}
            <RowStatuses />
        {/if}
    </svelte:fragment>
</CharacterTable>
