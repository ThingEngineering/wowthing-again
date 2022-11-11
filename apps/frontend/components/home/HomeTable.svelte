<script lang="ts">
    import { Constants } from '@/data/constants'
    import { userStore } from '@/stores'
    import { homeState } from '@/stores/local-storage'
    import { data as settings } from '@/stores/settings'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import GroupHead from './table/HomeTableGroupHead.svelte'
    import RowCovenant from './table/row/HomeTableRowCovenant.svelte'
    import RowCurrentLocation from './table/row/HomeTableRowCurrentLocation.svelte'
    import RowDailies from './table/row/HomeTableRowDailies.svelte'
    import RowGear from './table/row/HomeTableRowGear.svelte'
    import RowGold from './table/row/HomeTableRowGold.svelte'
    import RowHearthLocation from './table/row/HomeTableRowHearthLocation.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowKeystone from '@/components/character-table/row/Keystone.svelte'
    import RowLockouts from './table/row/HomeTableRowLockouts.svelte'
    import RowMountSpeed from './table/row/HomeTableRowMountSpeed.svelte'
    import RowMythicPlusScore from '@/components/character-table/row/RaiderIo.svelte'
    import RowPlayedTime from './table/row/HomeTableRowPlayedTime.svelte'
    import RowProfessions from './table/row/HomeTableRowProfessions.svelte'
    import RowRestedExperience from './table/row/HomeTableRowRestedExperience.svelte'
    import RowStatuses from './table/row/HomeTableRowStatuses.svelte'
    import RowTasks from './table/row/HomeTableRowTasks.svelte'
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

            {:else if field === 'hearthLocation'}
                {#if !$homeState.onlyWeekly}
                    <RowHearthLocation {character} />
                {/if}

            {:else if field === 'itemLevel'}
                {#if !$homeState.onlyWeekly}
                    <RowItemLevel />
                {/if}

            {:else if field === 'mountSpeed'}
                {#if !$homeState.onlyWeekly}
                    <RowMountSpeed {character} />
                {/if}

            {:else if field === 'keystone'}
                {#if (!isPublic || $settings.privacy.publicMythicPlus) && !$homeState.onlyWeekly}
                    <RowKeystone {character} />
                {/if}

            {:else if field === 'lockouts'}
                {#if !isPublic || $settings.privacy.publicLockouts}
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
    </svelte:fragment>
</CharacterTable>
