<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { progressQuestHead } from '@/data/quests'
    import { userStore } from '@/stores'
    import { homeState } from '@/stores/local-storage'
    import { data as settings } from '@/stores/settings'
    import tippy from '@/utils/tippy'
    import type {Character} from '@/types'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import HeadCallings from './head/HomeTableHeadCallings.svelte'
    import HeadCovenant from './head/HomeTableHeadCovenant.svelte'
    import HeadLockouts from './head/HomeTableHeadLockouts.svelte'
    import HeadMount from './head/HomeTableHeadMount.svelte'
    import HeadMythicPlusScore from './head/HomeTableHeadMythicPlusScore.svelte'
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
        isPublic = $userStore.data.public

        commonSpan = $settings.layout.commonFields
            .filter(field => !(field === 'accountTag' && !userStore.useAccountTags))
            .length

        gold = sumBy(group, (c: Character) => c.gold)
        playedTotal = sumBy(group, (c: Character) => c.playedTotal)
    }
</script>

<style lang="scss">
    .only-weekly {
        text-align: left;
    }
    tr :global(td:not(:first-child)) {
        border-left: 1px solid $border-color;
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

    {#each $settings.layout.homeFields as field}
        {#if field === 'callings'}
            {#if !$homeState.onlyWeekly}
                <HeadCallings />
            {/if}

        {:else if field === 'covenant'}
            {#if !$homeState.onlyWeekly}
                <HeadCovenant />
            {/if}

        {:else if field === 'gear'}
            {#if !$homeState.onlyWeekly}
                <td>Gear</td>
            {/if}

        {:else if field === 'gold'}
            {#if !isPublic && !$homeState.onlyWeekly}
                <RowGold {gold} />
            {/if}

        {:else if field === 'itemLevel'}
            {#if !$homeState.onlyWeekly}
                <td use:tippy={'Item Level'}>ilvl</td>
            {/if}

        {:else if field === 'keystone'}
            {#if (!isPublic || $settings.privacy.publicMythicPlus) && !$homeState.onlyWeekly}
                <td>Keystone</td>
            {/if}

        {:else if field === 'lockouts'}
            {#if !isPublic || $settings.privacy.publicLockouts}
                <HeadLockouts />
            {/if}

        {:else if field === 'mountSpeed'}
            {#if !$homeState.onlyWeekly}
                <HeadMount />
            {/if}

        {:else if field === 'mythicPlusScore'}
            {#if !$homeState.onlyWeekly}
                <HeadMythicPlusScore />
            {/if}

        {:else if field === 'playedTime'}
            {#if !isPublic && !$homeState.onlyWeekly}
                <RowPlayedTime {playedTotal} />
            {/if}

        {:else if field === 'professions'}
            {#if !$homeState.onlyWeekly}
                <td>Professions</td>
            {/if}

        {:else if field === 'restedExperience'}
            {#if !isPublic && !$homeState.onlyWeekly}
                <td>Rest</td>
            {/if}

        {:else if field === 'vaultMythicPlus'}
            <td>M+ Vault</td>

        {:else if field === 'vaultPvp'}
            <td>PvP Vault</td>

        {:else if field === 'vaultRaid'}
            <td>Raid Vault</td>

        {:else if field.startsWith('weekly')}
            {#if !isPublic || $settings.privacy.publicQuests}
                <td>{progressQuestHead[field]}</td>
            {/if}

        {:else}
            <td>&nbsp;</td>

        {/if}
    {/each}
</tr>
