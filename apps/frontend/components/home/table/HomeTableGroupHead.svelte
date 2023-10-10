<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { iconStrings } from '@/data/icons'
    import { settingsStore, userStore } from '@/stores'
    import { homeState } from '@/stores/local-storage'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
    import HeadCovenant from './head/HomeTableHeadCovenant.svelte'
    import HeadCurrentLocation from './head/HomeTableHeadCurrentLocation.svelte'
    import HeadHearthLocation from './head/HomeTableHeadHearthLocation.svelte'
    import HeadLockouts from './head/HomeTableHeadLockouts.svelte'
    import HeadTasks from './head/HomeTableHeadTasks.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import RowGold from './row/HomeTableRowGold.svelte'
    import RowPlayedTime from './row/HomeTableRowPlayedTime.svelte'
    import SpacerRow from '@/components/character-table/CharacterTableSpacerRow.svelte'

    export let group: Character[]
    export let groupIndex: number

    let commonSpan: number
    let gold: number
    let isPublic: boolean
    let playedTotal: number
    $: {
        isPublic = $userStore.public

        commonSpan = $settingsStore.layout.commonFields
            .filter(field => !(field === 'accountTag' && !userStore.useAccountTags))
            .length

        gold = sumBy(group, (c: Character) => c.gold)
        playedTotal = sumBy(group, (c: Character) => c.playedTotal)
    }

    function setSorting(column: string) {
        const current = $homeState.groupSort[groupIndex]
        $homeState.groupSort[groupIndex] = current === column ? undefined : column
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
        <Checkbox
            name="only_weekly"
            bind:value={$homeState.onlyWeekly}
        >Only weekly</Checkbox>
    </td>

    {#each $settingsStore.layout.homeFields as field}
        {#if field === 'callings'}
            {#if !$homeState.onlyWeekly}
                <td use:basicTooltip={"Shadowlands Callings"}>
                    <IconifyIcon icon={iconStrings['calendar-quest']} /> SL
                </td>
            {/if}
        
        {:else if field === 'covenant'}
            {#if !$homeState.onlyWeekly}
                <HeadCovenant />
            {/if}
        
        {:else if field === 'currentLocation'}
            {#if !$homeState.onlyWeekly}
                <HeadCurrentLocation {groupIndex} />
            {/if}

        {:else if field === 'emissariesBfa'}
            {#if !$homeState.onlyWeekly}
                <td use:basicTooltip={"Battle for Azeroth Emissaries"}>
                    <IconifyIcon icon={iconStrings['calendar-quest']} /> BfA
                </td>
            {/if}

        {:else if field === 'emissariesLegion'}
            {#if !$homeState.onlyWeekly}
                <td use:basicTooltip={"Legion Emissaries"}>
                    <IconifyIcon icon={iconStrings['calendar-quest']} /> Legion
                </td>
            {/if}
        
        {:else if field === 'gear'}
            {#if !$homeState.onlyWeekly}
                <td>Gear</td>
            {/if}

        {:else if field === 'gold'}
            {#if !isPublic && !$homeState.onlyWeekly}
                <RowGold
                    {gold}
                    {groupIndex}
                    showSortable={true}
                />
            {/if}
        
        {:else if field === 'guild'}
            <td>Guild</td>

        {:else if field === 'hearthLocation'}
            {#if !$homeState.onlyWeekly}
                <HeadHearthLocation {groupIndex} />
            {/if}

        {:else if field === 'itemLevel'}
            {#if !$homeState.onlyWeekly}
                <td
                    class="sortable"
                    class:sorted-by={$homeState.groupSort[groupIndex] === field}
                    on:click={() => setSorting(field)}
                    on:keypress={() => setSorting(field)}
                    use:basicTooltip={'Item Level'}
                >ilvl</td>
            {/if}

        {:else if field === 'keystone'}
            {#if (!isPublic || $settingsStore.privacy.publicMythicPlus) && !$homeState.onlyWeekly}
                {@const sortKey = 'mythicPlusKeystone'}
                <td
                    class="sortable"
                    class:sorted-by={$homeState.groupSort[groupIndex] === sortKey}
                    on:click={() => setSorting(sortKey)}
                    on:keypress={() => setSorting(sortKey)}
                >
                    M+ Key
                </td>
            {/if}

        {:else if field === 'lockouts'}
            {#if !isPublic || $settingsStore.privacy.publicLockouts}
                <HeadLockouts {groupIndex} />
            {/if}

        {:else if field === 'mountSpeed'}
            <!-- remove later -->

        {:else if field === 'mythicPlusScore'}
            {#if !$homeState.onlyWeekly}
                <td
                    class="mythic-plus-score sortable"
                    class:sorted-by={$homeState.groupSort[groupIndex] === field}
                    on:click={() => setSorting(field)}
                    on:keypress={() => setSorting(field)}
                >
                    M+
                </td>
            {/if}

        {:else if field === 'playedTime'}
            {#if !isPublic && !$homeState.onlyWeekly}
                <RowPlayedTime {playedTotal} />
            {/if}

        {:else if field === 'professionCooldowns'}
            {#if !$homeState.onlyWeekly}
                <td>CDs</td>
            {/if}

        {:else if field === 'professions'}
            {#if !$homeState.onlyWeekly}
                <td>Professions</td>
            {/if}

        {:else if field === 'professionsSecondary'}
            {#if !$homeState.onlyWeekly}
                <td>Secondary Profs</td>
            {/if}

        {:else if field === 'restedExperience'}
            {#if !isPublic && !$homeState.onlyWeekly}
                {@const sortKey = 'restedExperience'}
                <td
                    class="sortable"
                    class:sorted-by={$homeState.groupSort[groupIndex] === sortKey}
                    on:click={() => setSorting(sortKey)}
                    on:keypress={() => setSorting(sortKey)}
                >
                    Rest
                </td>
            {/if}

        {:else if field === 'tasks'}
            <HeadTasks {groupIndex} />

        {:else if field === 'vaultMythicPlus'}
            <td
                class="sortable"
                class:sorted-by={$homeState.groupSort[groupIndex] === field}
                on:click={() => setSorting(field)}
                on:keypress={() => setSorting(field)}
            >M+ Vault</td>

        {:else if field === 'vaultPvp'}
            <td>PvP Vault</td>

        {:else if field === 'vaultRaid'}
            <td>Raid Vault</td>

        {:else}
            {#if !$homeState.onlyWeekly}
                <td>&nbsp;</td>
            {/if}

        {/if}
    {/each}
</tr>
