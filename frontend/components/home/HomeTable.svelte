<script lang="ts">
    import { Constants } from '@/data/constants'
    import { data as settings } from '@/stores/settings'
    import { userStore } from '@/stores'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import GroupHead from './table/HomeTableGroupHead.svelte'
    import RowCallings from './table/row/HomeTableRowCallings.svelte'
    import RowCovenant from './table/row/HomeTableRowCovenant.svelte'
    import RowGold from './table/row/HomeTableRowGold.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowLockouts from './table/row/HomeTableRowLockouts.svelte'
    import RowMountSpeed from './table/row/HomeTableRowMountSpeed.svelte'
    import RowMythicPlusScore from '@/components/character-table/row/RaiderIo.svelte'
    import RowPlayedTime from './table/row/HomeTableRowPlayedTime.svelte'
    import RowProfessions from './table/row/HomeTableRowProfessions.svelte'
    import RowProgressQuest from './table/row/HomeTableRowProgressQuest.svelte'
    import RowRestedExperience from './table/row/HomeTableRowRestedExperience.svelte'
    import RowStatuses from './table/row/HomeTableRowStatuses.svelte'
    import RowTorghast from './table/row/HomeTableRowTorghast.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'
    import RowVaultPvp from '@/components/character-table/row/VaultPvp.svelte'
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
            {#if field === 'callings'}
                <RowCallings {character} />

            {:else if field === 'covenant'}
                <RowCovenant {character} />

            {:else if field === 'gold'}
                {#if !isPublic}
                    <RowGold gold={character.gold} />
                {/if}

            {:else if field === 'itemLevel'}
                <RowItemLevel />

            {:else if field === 'mountSpeed'}
                <RowMountSpeed />

            {:else if field === 'keystone'}
                {#if !isPublic || $settings.privacy.publicMythicPlus}
                    <RowKeystone {character} />
                {/if}

            {:else if field === 'lockouts'}
                {#if !isPublic || $settings.privacy.publicLockouts}
                    <RowLockouts {character} />
                {/if}

            {:else if field === 'mythicPlusScore'}
                <RowMythicPlusScore
                    seasonId={Constants.mythicPlusSeason}
                    {character}
                />

            {:else if field === 'playedTime'}
                {#if !isPublic}
                    <RowPlayedTime playedTotal={character.playedTotal} />
                {/if}

            {:else if field === 'professions'}
                <RowProfessions {character} />

            {:else if field === 'restedExperience'}
                {#if !isPublic}
                    <RowRestedExperience {character} />
                {/if}

            {:else if field === 'statusIcons'}
                <RowStatuses />

            {:else if field === 'torghast'}
                <RowTorghast {character} />

            {:else if field === 'vaultMythicPlus'}
                <RowVaultMythicPlus {character} />

            {:else if field === 'vaultPvp'}
                <RowVaultPvp {character} />

            {:else if field === 'vaultRaid'}
                <RowVaultRaid {character} />

            {:else if field === 'weeklyAnima'}
                <RowProgressQuest
                    {character}
                    quest={'anima'}
                />

            {:else if field === 'weeklyKorthia'}
                <RowProgressQuest
                    {character}
                    quest={'shapingFate'}
                />

            {:else if field === 'weeklySouls'}
                <RowProgressQuest
                    {character}
                    quest={'souls'}
                />

            {:else}
                <td>&nbsp;</td>

            {/if}
        {/each}
    </svelte:fragment>
</CharacterTable>
