<script lang="ts">
    import sumBy from 'lodash/sumBy';

    import { iconStrings } from '@/data/icons';
    import { browserState } from '@/shared/state/browser.svelte';
    import { sharedState } from '@/shared/state/shared.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { Character } from '@/types';
    import type { GroupByContext } from '@/utils/get-character-group-func';

    import HeadBagSpace from '@/components/character-table/head/BagSpace.svelte';
    import HeadCovenant from './head/HomeTableHeadCovenant.svelte';
    import HeadCurrencies from './head/HomeTableHeadCurrencies.svelte';
    import HeadCurrentLocation from './head/HomeTableHeadCurrentLocation.svelte';
    import HeadGroupedByCell from '@/components/home/table/head/HomeTableHeadGroupedByCell.svelte';
    import HeadHearthLocation from './head/HomeTableHeadHearthLocation.svelte';
    import HeadItems from './head/HomeTableHeadItems.svelte';
    import HeadLockouts from './head/HomeTableHeadLockouts.svelte';
    import HeadMovementSpeed from '@/components/character-table/head/MovementSpeed.svelte';
    import HeadProgress from './head/HomeTableHeadProgress.svelte';
    import HeadTasks from './head/HomeTableHeadTasks.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import RowGold from './row/HomeTableRowGold.svelte';
    import RowPlayedTime from './row/HomeTableRowPlayedTime.svelte';
    import SpacerRow from '@/components/character-table/CharacterTableSpacerRow.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        group: Character[];
        groupIndex: number;
        groupByContext: GroupByContext;
    };
    let { group, groupByContext, groupIndex }: Props = $props();

    let sortKey = $derived(`${settingsState.activeView.id}|${groupIndex}`);

    let isPublic = $derived(sharedState.public);

    let commonSpan = $derived(
        settingsState.activeView.commonFields.filter(
            (field) => !(field === 'accountTag' && !settingsState.useAccountTags)
        ).length
    );
    let gold = $derived(sumBy(group, (c: Character) => c.gold));
    let playedTotal = $derived(sumBy(group, (c: Character) => c.playedTotal));

    const getGetSortState = $derived((field: string) => (suffix?: string) => {
        const sortedBy = browserState.current.home.groupSort[sortKey];
        const reversed = browserState.current.home.groupSortReverse[sortKey];

        const actualField = suffix ? `${field}:${suffix}` : field;
        if (sortedBy === actualField) {
            return reversed ? 2 : 1;
        } else {
            return 0;
        }
    });

    const getSetSortState = $derived((field: string) => (suffix?: string) => {
        const sortedBy = browserState.current.home.groupSort[sortKey];
        const reversed = browserState.current.home.groupSortReverse[sortKey];

        const actualField = suffix ? `${field}:${suffix}` : field;
        if (sortedBy === actualField) {
            if (reversed) {
                delete browserState.current.home.groupSort[sortKey];
                delete browserState.current.home.groupSortReverse[sortKey];
            } else {
                browserState.current.home.groupSortReverse[sortKey] = true;
            }
        } else {
            browserState.current.home.groupSort[sortKey] = actualField;
            browserState.current.home.groupSortReverse[sortKey] = false;
        }
    });
</script>

<style lang="scss">
    .only-weekly {
        padding: 0 $width-padding;
    }
    tr {
        --scale: 0.91;

        :global(td:not(:first-child)) {
            border-left: 1px solid var(--border-color);
        }
        :global(.sortable) {
            cursor: pointer;
        }
        :global(.sorted-by) {
            border: 1px solid #eee !important;
        }
        :global(.sorted-1) {
            border: 1px solid;
            border-image-slice: 1;
            border-image-source: linear-gradient(to top, #9f9f00, #00ff00);
        }
        :global(.sorted-2) {
            border: 1px solid;
            border-image-slice: 1;
            border-image-source: linear-gradient(to bottom, #9f9f00, #ff0000);
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
    <td class="only-weekly" colspan={commonSpan}>
        <HeadGroupedByCell {groupByContext} {group} />
    </td>

    {#each settingsState.activeView.homeFields as field (field)}
        {@const getSortState = getGetSortState(field)}
        {@const setSortState = getSetSortState(field)}

        {#if field === 'bagSpace'}
            <HeadBagSpace {getSortState} {setSortState} />
        {:else if field === 'bestItemLevel'}
            <td
                class="sortable sorted-{getSortState()}"
                onclick={() => setSortState()}
                use:basicTooltip={'Best Item Level'}>Best</td
            >
        {:else if field === 'callings'}
            <td use:basicTooltip={'Shadowlands Callings'}>
                <IconifyIcon icon={iconStrings['calendar-quest']} /> SL
            </td>
        {:else if field === 'covenant'}
            <HeadCovenant />
        {:else if field === 'currencies'}
            <HeadCurrencies {getSortState} {setSortState} />
        {:else if field === 'currentLocation'}
            <HeadCurrentLocation {getSortState} {setSortState} />
        {:else if field === 'emissariesBfa'}
            <td use:basicTooltip={'Battle for Azeroth Emissaries'}>
                <IconifyIcon icon={iconStrings['calendar-quest']} /> BfA
            </td>
        {:else if field === 'emissariesLegion'}
            <td use:basicTooltip={'Legion Emissaries'}>
                <IconifyIcon icon={iconStrings['calendar-quest']} /> Legion
            </td>
        {:else if field === 'gear'}
            <td>Gear</td>
        {:else if field === 'gold'}
            {#if !isPublic}
                <RowGold {gold} showSortable={true} {getSortState} {setSortState} />
            {/if}
        {:else if field === 'goldWorldQuests'}
            <td>
                <WowthingImage name="currency/0" size={16} />
                WQ
            </td>
        {:else if field === 'guild'}
            <td>Guild</td>
        {:else if field === 'hearthLocation'}
            <HeadHearthLocation {getSortState} {setSortState} />
        {:else if field === 'itemLevel'}
            <td
                class="sortable sorted-{getSortState()}"
                onclick={() => setSortState()}
                use:basicTooltip={'Equipped Item Level'}>Equip</td
            >
        {:else if field === 'items'}
            {#if !isPublic}
                <HeadItems {getSortState} {setSortState} />
            {/if}
        {:else if field === 'keystone'}
            {#if !isPublic || settingsState.value.privacy.publicMythicPlus}
                <td class="sortable sorted-{getSortState()}" onclick={() => setSortState()}>
                    M+ Key
                </td>
            {/if}
        {:else if field === 'lastSeenAddon'}
            <td class="sortable sorted-{getSortState()}" onclick={() => setSortState()}> Seen </td>
        {:else if field === 'lockouts'}
            {#if !isPublic || settingsState.value.privacy.publicLockouts}
                <HeadLockouts {getSortState} {setSortState} />
            {/if}
        {:else if field === 'mythicPlusScore'}
            <td
                class="mythic-plus-score sortable sorted-{getSortState()}"
                onclick={() => setSortState()}
            >
                M+
            </td>
        {:else if field === 'playedTime'}
            {#if !isPublic}
                <RowPlayedTime {playedTotal} />
            {/if}
        {:else if field === 'professionConcentration'}
            <td>Concentration</td>
        {:else if field === 'professionCooldowns'}
            <td
                class="sortable sorted-{getSortState()}"
                onclick={() => setSortState()}
                use:basicTooltip={'Profession Cooldowns'}>CDs</td
            >
        {:else if field === 'professionWorkOrders'}
            <td
                class="sortable sorted-{getSortState()}"
                onclick={() => setSortState()}
                use:basicTooltip={'Profession Work Orders'}>WOs</td
            >
        {:else if field === 'professions'}
            <td>Professions</td>
        {:else if field === 'professionsSecondary'}
            <td>Secondary Profs</td>
        {:else if field === 'progress'}
            <HeadProgress {getSortState} {setSortState} />
        {:else if field === 'restedExperience'}
            {#if !isPublic}
                <td class="sortable sorted-{getSortState()}" onclick={() => setSortState()}>
                    Rest
                </td>
            {/if}
        {:else if field === 'statsSpeed'}
            <HeadMovementSpeed {getSortState} {setSortState} />
        {:else if field === 'tasks'}
            <HeadTasks {getSortState} {setSortState} />
        {:else if field === 'vaultMythicPlus'}
            <td class="sortable sorted-{getSortState()}" onclick={() => setSortState()}
                >Dungeon Vault</td
            >
        {:else if field === 'vaultRaid'}
            <td class="sortable sorted-{getSortState()}" onclick={() => setSortState()}
                >Raid Vault</td
            >
        {:else if field === 'vaultWorld'}
            <td class="sortable sorted-{getSortState()}" onclick={() => setSortState()}
                >World Vault</td
            >
        {:else}
            <td>&nbsp;</td>
        {/if}
    {/each}

    {#if !isPublic}
        <td class="settings"></td>
    {/if}
</tr>
