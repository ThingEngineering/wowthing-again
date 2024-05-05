<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { iconStrings } from '@/data/icons'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { userStore } from '@/stores'
    import { homeState } from '@/stores/local-storage'
    import { activeView, settingsStore } from '@/shared/stores/settings'
    import type { Character } from '@/types'

    import HeadCovenant from './head/HomeTableHeadCovenant.svelte'
    import HeadCurrencies from './head/HomeTableHeadCurrencies.svelte'
    import HeadCurrentLocation from './head/HomeTableHeadCurrentLocation.svelte'
    import HeadHearthLocation from './head/HomeTableHeadHearthLocation.svelte'
    import HeadItems from './head/HomeTableHeadItems.svelte'
    import HeadLockouts from './head/HomeTableHeadLockouts.svelte'
    import HeadTasks from './head/HomeTableHeadTasks.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import RowGold from './row/HomeTableRowGold.svelte'
    import RowPlayedTime from './row/HomeTableRowPlayedTime.svelte'
    import SpacerRow from '@/components/character-table/CharacterTableSpacerRow.svelte'

    export let group: Character[]
    export let groupIndex: number

    $: sortKey = `${$activeView.id}|${groupIndex}`

    let commonSpan: number
    let gold: number
    let isPublic: boolean
    let playedTotal: number
    $: {
        isPublic = $userStore.public

        commonSpan = $activeView.commonFields
            .filter(field => !(field === 'accountTag' && !userStore.useAccountTags))
            .length

        gold = sumBy(group, (c: Character) => c.gold)
        playedTotal = sumBy(group, (c: Character) => c.playedTotal)
    }

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey]
        $homeState.groupSort[sortKey] = current === column ? undefined : column
    }
</script>

<style lang="scss">
    .only-weekly {
        text-align: left;
    }
    tr {
        --scale: 0.91;
        
        :global(td:not(:first-child)) {
            border-left: 1px solid $border-color;
        }
        :global(.sortable) {
            cursor: pointer;
        }
        :global(.sorted-by) {
            border: 1px solid #eee !important;
        }
    }
    td {
        text-align: center;
    }
    .mythic-plus-score {
        @include cell-width($width-raider-io);
    }
</style>

{#if groupIndex > 0}
    <SpacerRow />
{/if}

<tr class="table-group-head">
    <td class="only-weekly" colspan="{commonSpan}">
    </td>

    {#each $activeView.homeFields as field (field)}
        {#if field === 'bestItemLevel'}
            <td
                class="sortable"
                class:sorted-by={$homeState.groupSort[sortKey] === field}
                on:click={() => setSorting(field)}
                on:keypress={() => setSorting(field)}
                use:basicTooltip={'Best Item Level'}
            >Best</td>

        {:else if field === 'callings'}
            <td use:basicTooltip={"Shadowlands Callings"}>
                <IconifyIcon icon={iconStrings['calendar-quest']} /> SL
            </td>
        
        {:else if field === 'covenant'}
            <HeadCovenant />

        {:else if field === 'currencies'}
            <HeadCurrencies {sortKey} />
        
        {:else if field === 'currentLocation'}
            <HeadCurrentLocation {sortKey} />

        {:else if field === 'emissariesBfa'}
            <td use:basicTooltip={"Battle for Azeroth Emissaries"}>
                <IconifyIcon icon={iconStrings['calendar-quest']} /> BfA
            </td>

        {:else if field === 'emissariesLegion'}
            <td use:basicTooltip={"Legion Emissaries"}>
                <IconifyIcon icon={iconStrings['calendar-quest']} /> Legion
            </td>
        
        {:else if field === 'gear'}
            <td>Gear</td>

        {:else if field === 'gold'}
            {#if !isPublic}
                <RowGold
                    {gold}
                    {sortKey}
                    showSortable={true}
                />
            {/if}
        
        {:else if field === 'guild'}
            <td>Guild</td>

        {:else if field === 'hearthLocation'}
            <HeadHearthLocation {sortKey} />

        {:else if field === 'itemLevel'}
            <td
                class="sortable"
                class:sorted-by={$homeState.groupSort[sortKey] === field}
                on:click={() => setSorting(field)}
                on:keypress={() => setSorting(field)}
                use:basicTooltip={'Equipped Item Level'}
            >Equip</td>
        
        {:else if field === 'items'}
            {#if !isPublic}
                <HeadItems {sortKey} />
            {/if}

        {:else if field === 'keystone'}
            {#if !isPublic || $settingsStore.privacy.publicMythicPlus}
                {@const sortField = 'mythicPlusKeystone'}
                <td
                    class="sortable"
                    class:sorted-by={$homeState.groupSort[sortKey] === sortField}
                    on:click={() => setSorting(sortField)}
                    on:keypress={() => setSorting(sortField)}
                >
                    M+ Key
                </td>
            {/if}

        {:else if field === 'lockouts'}
            {#if !isPublic || $settingsStore.privacy.publicLockouts}
                <HeadLockouts {sortKey} />
            {/if}

        {:else if field === 'mountSpeed'}
            <!-- remove later -->

        {:else if field === 'mythicPlusScore'}
            <td
                class="mythic-plus-score sortable"
                class:sorted-by={$homeState.groupSort[sortKey] === field}
                on:click={() => setSorting(field)}
                on:keypress={() => setSorting(field)}
            >
                M+
            </td>

        {:else if field === 'playedTime'}
            {#if !isPublic}
                <RowPlayedTime {playedTotal} />
            {/if}

        {:else if field === 'professionCooldowns'}
            <td
                class="sortable"
                class:sorted-by={$homeState.groupSort[sortKey] === field}
                on:click={() => setSorting(field)}
                on:keypress={() => setSorting(field)}
                use:basicTooltip={'Profession Cooldowns'}
            >CDs</td>

        {:else if field === 'professionWorkOrders'}
            <td
                class="sortable"
                class:sorted-by={$homeState.groupSort[sortKey] === field}
                on:click={() => setSorting(field)}
                on:keypress={() => setSorting(field)}
                use:basicTooltip={'Profession Work Orders'}
            >WOs</td>

        {:else if field === 'professions'}
            <td>Professions</td>

        {:else if field === 'professionsSecondary'}
            <td>Secondary Profs</td>

        {:else if field === 'restedExperience'}
            {#if !isPublic}
                {@const sortField = 'restedExperience'}
                <td
                    class="sortable"
                    class:sorted-by={$homeState.groupSort[sortKey] === sortField}
                    on:click={() => setSorting(sortField)}
                    on:keypress={() => setSorting(sortField)}
                >
                    Rest
                </td>
            {/if}

        {:else if field === 'tasks'}
            <HeadTasks {sortKey} />

        {:else if field === 'vaultMythicPlus'}
            <td
                class="sortable"
                class:sorted-by={$homeState.groupSort[sortKey] === field}
                on:click={() => setSorting(field)}
                on:keypress={() => setSorting(field)}
            >Dungeon Vault</td>

        {:else if field === 'vaultPvp'}
            <td>PvP Vault</td>

        {:else if field === 'vaultRaid'}
            <td>Raid Vault</td>

        {:else}
            <td>&nbsp;</td>

        {/if}
    {/each}

    {#if !isPublic}
        <td class="settings"></td>
    {/if}
</tr>
