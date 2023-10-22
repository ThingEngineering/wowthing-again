<script lang="ts">
    import { Constants } from '@/data/constants'
    import { settingsStore, userStore } from '@/stores'
    import { homeState } from '@/stores/local-storage'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import GroupHead from './table/HomeTableGroupHead.svelte'
    import RowCovenant from './table/row/HomeTableRowCovenant.svelte'
    import RowCurrentLocation from './table/row/HomeTableRowCurrentLocation.svelte'
    import RowDailies from './table/row/HomeTableRowDailies.svelte'
    import RowGear from './table/row/HomeTableRowGear.svelte'
    import RowGold from './table/row/HomeTableRowGold.svelte'
    import RowGuild from './table/row/HomeTableRowGuild.svelte'
    import RowHearthLocation from './table/row/HomeTableRowHearthLocation.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowLockouts from './table/row/HomeTableRowLockouts.svelte'
    import RowMythicPlusScore from '@/components/character-table/row/RaiderIo.svelte'
    import RowPlayedTime from './table/row/HomeTableRowPlayedTime.svelte'
    import RowProfessions from './table/row/HomeTableRowProfessions.svelte'
    import RowProfessionCooldowns from './table/row/HomeTableRowProfessionCooldowns.svelte'
    import RowProfessionWorkOrders from './table/row/HomeTableRowProfessionWorkOrders.svelte'
    import RowRestedExperience from './table/row/HomeTableRowRestedExperience.svelte'
    import RowSettings from './table/row/HomeTableRowSettings.svelte'
    import RowStatuses from './table/row/HomeTableRowStatuses.svelte'
    import RowTasks from './table/row/HomeTableRowTasks.svelte'
    import RowVaultMythicPlus from '@/components/character-table/row/VaultMythicPlus.svelte'
    import RowVaultPvp from '@/components/character-table/row/VaultPvp.svelte'
    import RowVaultRaid from '@/components/character-table/row/VaultRaid.svelte'

    export let characterLimit = 0

    let isPublic: boolean
    $: {
        isPublic = $userStore.public
    }
</script>

<CharacterTable
    isHome={true}
    {characterLimit}
>
    <GroupHead
        slot="groupHead"
        {group}
        {groupIndex}
        let:group
        let:groupIndex
    />

    <svelte:fragment slot="rowExtra" let:character>
        {#each $settingsStore.layout.homeFields as field}
            {#if field === 'callings'}
                {#if !$homeState.onlyWeekly}
                    <RowDailies
                        expansion={8}
                        {character}
                    />
                {/if}

            {:else if field === 'covenant'}
                {#if !$homeState.onlyWeekly}
                    <RowCovenant {character} />
                {/if}
                
            {:else if field === 'currentLocation'}
                {#if !$homeState.onlyWeekly}
                    <RowCurrentLocation {character} />
                {/if}

            {:else if field === 'emissariesBfa'}
                {#if !$homeState.onlyWeekly}
                    <RowDailies
                        expansion={7}
                        {character}
                    />
                {/if}

            {:else if field === 'emissariesLegion'}
                {#if !$homeState.onlyWeekly}
                    <RowDailies
                        expansion={6}
                        {character}
                    />
                {/if}

            {:else if field === 'gear'}
                {#if !$homeState.onlyWeekly}
                    <RowGear {character} />
                {/if}

            {:else if field === 'gold'}
                {#if !isPublic && !$homeState.onlyWeekly}
                    <RowGold gold={character.gold} />
                {/if}
            
            {:else if field === 'guild'}
                <RowGuild {character} />

            {:else if field === 'hearthLocation'}
                {#if !$homeState.onlyWeekly}
                    <RowHearthLocation {character} />
                {/if}

            {:else if field === 'itemLevel'}
                {#if !$homeState.onlyWeekly}
                    <RowItemLevel {character} />
                {/if}

            {:else if field === 'mountSpeed'}
                <!-- remove later -->

            {:else if field === 'keystone'}
                {#if (!isPublic || $settingsStore.privacy.publicMythicPlus) && !$homeState.onlyWeekly}
                    <RowKeystone {character} />
                {/if}

            {:else if field === 'lockouts'}
                {#if !isPublic || $settingsStore.privacy.publicLockouts}
                    <RowLockouts {character} />
                {/if}

            {:else if field === 'mythicPlusScore'}
                {#if !$homeState.onlyWeekly}
                    <RowMythicPlusScore
                        seasonId={Constants.mythicPlusSeason}
                        {character}
                    />
                {/if}

            {:else if field === 'playedTime'}
                {#if !isPublic && !$homeState.onlyWeekly}
                    <RowPlayedTime playedTotal={character.playedTotal} />
                {/if}
            
            {:else if field === 'professionCooldowns'}
                {#if !$homeState.onlyWeekly}
                    <RowProfessionCooldowns {character} />
                {/if}
            
            {:else if field === 'professionWorkOrders'}
                {#if !$homeState.onlyWeekly}
                    <RowProfessionWorkOrders {character} />
                {/if}

            {:else if field === 'professions'}
                {#if !$homeState.onlyWeekly}
                    <RowProfessions {character} />
                {/if}
    
            {:else if field === 'professionsSecondary'}
                {#if !$homeState.onlyWeekly}
                    <RowProfessions {character} professionType={1} />
                {/if}

            {:else if field === 'restedExperience'}
                {#if !isPublic && !$homeState.onlyWeekly}
                    <RowRestedExperience {character} />
                {/if}

            {:else if field === 'statusIcons'}
                {#if !$homeState.onlyWeekly}
                    <RowStatuses {character} />
                {/if}

            {:else if field === 'tasks'}
                <RowTasks {character} />

            {:else if field === 'vaultMythicPlus'}
                <RowVaultMythicPlus {character} />

            {:else if field === 'vaultPvp'}
                <RowVaultPvp {character} />

            {:else if field === 'vaultRaid'}
                <RowVaultRaid {character} />

            {:else}
                <td>&nbsp;</td>

            {/if}
        {/each}

        {#if !isPublic}
            <RowSettings {character} />
        {/if}
    </svelte:fragment>
</CharacterTable>
