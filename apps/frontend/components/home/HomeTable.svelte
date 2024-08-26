<script lang="ts">
    import { Constants } from '@/data/constants'
    import { userStore } from '@/stores'
    import { activeView, settingsStore } from '@/shared/stores/settings'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import GroupHead from './table/HomeTableGroupHead.svelte'
    import RowBestItemLevel from '@/components/character-table/row/BestItemLevel.svelte'
    import RowCovenant from './table/row/HomeTableRowCovenant.svelte'
    import RowCurrencies from './table/row/HomeTableRowCurrencies.svelte'
    import RowCurrentLocation from './table/row/HomeTableRowCurrentLocation.svelte'
    import RowDailies from './table/row/HomeTableRowDailies.svelte'
    import RowGear from './table/row/HomeTableRowGear.svelte'
    import RowGold from './table/row/HomeTableRowGold.svelte'
    import RowGuild from './table/row/HomeTableRowGuild.svelte'
    import RowHearthLocation from './table/row/HomeTableRowHearthLocation.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './table/row/HomeTableRowItems.svelte'
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
    import RowVaultRaid from '@/components/character-table/row/VaultRaid.svelte'
    import RowVaultWorld from '@/components/character-table/row/VaultWorld.svelte'
    import ViewSwitcher from './table/ViewSwitcher.svelte'

    export let characterLimit = 0

    $: isPublic = $userStore.public
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0;
    }
</style>

<div class="wrapper-column">
    <ViewSwitcher />

    <CharacterTable
        isHome={true}
        {characterLimit}
    >
        <GroupHead
            slot="groupHead"
            {group}
            {groupIndex}
            {groupByContext}
            let:group
            let:groupIndex
            let:groupByContext
        />

        <svelte:fragment slot="rowExtra" let:character>
            {#each $activeView.homeFields as field (field)}
                {#if field === 'bestItemLevel'}
                    <RowBestItemLevel {character} />

                {:else if field === 'callings'}
                    <RowDailies
                        expansion={8}
                        {character}
                    />

                {:else if field === 'covenant'}
                    <RowCovenant {character} />

                {:else if field === 'currencies'}
                    <RowCurrencies {character} />

                {:else if field === 'currentLocation'}
                    <RowCurrentLocation {character} />

                {:else if field === 'emissariesBfa'}
                    <RowDailies
                        expansion={7}
                        {character}
                    />

                {:else if field === 'emissariesLegion'}
                    <RowDailies
                        expansion={6}
                        {character}
                    />

                {:else if field === 'gear'}
                    <RowGear {character} />

                {:else if field === 'gold'}
                    {#if !isPublic}
                        <RowGold gold={character.gold} />
                    {/if}

                {:else if field === 'guild'}
                    <RowGuild {character} />

                {:else if field === 'hearthLocation'}
                    <RowHearthLocation {character} />

                {:else if field === 'itemLevel'}
                    <RowItemLevel {character} />

                {:else if field === 'items'}
                    <RowItems {character} />

                {:else if field === 'keystone'}
                    {#if !isPublic || $settingsStore.privacy.publicMythicPlus}
                        <RowKeystone {character} />
                    {/if}

                {:else if field === 'lockouts'}
                    {#if !isPublic || $settingsStore.privacy.publicLockouts}
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

                {:else if field === 'professionCooldowns'}
                    <RowProfessionCooldowns {character} />

                {:else if field === 'professionWorkOrders'}
                    <RowProfessionWorkOrders {character} />

                {:else if field === 'professions'}
                    <RowProfessions {character} />

                {:else if field === 'professionsSecondary'}
                    <RowProfessions {character} professionType={1} />

                {:else if field === 'restedExperience'}
                    {#if !isPublic}
                        <RowRestedExperience {character} />
                    {/if}

                {:else if field === 'statusIcons'}
                    <RowStatuses {character} />

                {:else if field === 'tasks'}
                    <RowTasks {character} />

                {:else if field === 'vaultMythicPlus'}
                    <RowVaultMythicPlus {character} />

                {:else if field === 'vaultRaid'}
                    <RowVaultRaid {character} />

                {:else if field === 'vaultWorld'}
                    <RowVaultWorld {character} />

                {:else}
                    <td>&nbsp;</td>

                {/if}
            {/each}

            {#if !isPublic}
                <RowSettings {character} />
            {/if}
        </svelte:fragment>
    </CharacterTable>
</div>
