<script lang="ts">
    import { Constants } from '@/data/constants'
    import { data as settings } from '@/stores/settings'
    import { userStore } from '@/stores'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import GroupHead from './table/HomeTableGroupHead.svelte'
    import RowCovenant from './table/row/HomeTableRowCovenant.svelte'
    import RowGold from './table/row/HomeTableRowGold.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowMountSpeed from './table/row/HomeTableRowMountSpeed.svelte'
    import RowPlayedTime from './table/row/HomeTableRowPlayedTime.svelte'
    import RowStatuses from './table/row/HomeTableRowStatuses.svelte'
    import RowTorghast from './table/row/HomeTableRowTorghast.svelte'
    import RowUghQuest from './table/row/HomeTableRowUghQuest.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'
    import RowVaultRaid from '@/components/character-table/row/VaultRaid.svelte'

    export let characterLimit = 0

    let isPublic: boolean
    $: {
        isPublic = $userStore.data.public
    }
</script>

<CharacterTable {characterLimit}>
    <GroupHead slot="groupHead" let:group let:groupIndex {group} {groupIndex} />

    <svelte:fragment slot="rowExtra" let:character>
        {#each $settings.layout.homeFields as field}
            {#if field === 'covenant'}
                <RowCovenant />

            {:else if field === 'gold' && !isPublic}
                <RowGold gold={character.gold} />

            {:else if field === 'itemLevel'}
                <RowItemLevel />

            {:else if field === 'mountSpeed'}
                <RowMountSpeed />

            {:else if field === 'keystone'}
                <RowKeystone {character} />

            {:else if field === 'playedTime'}
                <RowPlayedTime playedTotal={character.playedTotal} />

            {:else if field === 'status'}
                <RowStatuses />

            {:else if field === 'torghast'}
                <RowTorghast {character} />

            {:else if field === 'vaultMythicPlus'}
                <RowVaultMythicPlus {character} />

            <!--{:else if field === 'vaultPvp'}
                <RowVaultPvp {character} />-->

            {:else if field === 'vaultRaid'}
                <RowVaultRaid {character} />

            {:else if field === 'weeklyAnima'}
                <RowUghQuest
                    {character}
                    icon={Constants.icons.weeklyAnima}
                    ughQuest={character.weekly?.ughQuests?.['anima']}
                    cls="anima"
                />

            {:else if field === 'weeklyKorthia'}
                <RowUghQuest
                    {character}
                    icon={Constants.icons.weeklyAnima}
                    ughQuest={character.weekly?.ughQuests?.['shapingFate']}
                />

            {:else if field === 'weeklySouls'}
                <RowUghQuest
                    {character}
                    icon={Constants.icons.weeklyAnima}
                    ughQuest={character.weekly?.ughQuests?.['souls']}
                />
            {/if}
        {/each}
    </svelte:fragment>
</CharacterTable>
