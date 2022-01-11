<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { data as settings } from '@/stores/settings'
    import { userStore } from '@/stores'
    import type {Character} from '@/types'

    import HeadCallings from './head/HomeTableHeadCallings.svelte'
    import HeadCovenant from './head/HomeTableHeadCovenant.svelte'
    import HeadLockouts from './head/HomeTableHeadLockouts.svelte'
    import HeadMount from './head/HomeTableHeadMount.svelte'
    import HeadTorghast from './head/HomeTableHeadTorghast.svelte'
    import RowGold from './row/HomeTableRowGold.svelte'
    import RowPlayedTime from './row/HomeTableRowPlayedTime.svelte'
    import SpacerRow from '@/components/character-table/CharacterTableSpacerRow.svelte'

    export let group: Character[]
    export let groupIndex: number

    let gold: number
    let isPublic: boolean
    let playedTotal: number
    $: {
        isPublic = $userStore.data.public

        gold = sumBy(group, (c: Character) => c.gold)
        playedTotal = sumBy(group, (c: Character) => c.playedTotal)
    }
</script>

{#if groupIndex > 0}
    <SpacerRow />
{/if}

<tr class="table-group-head">
    {#each $settings.layout.commonFields as field}
        {#if !(field === 'accountTag' && isPublic)}
            <td></td>
        {/if}
    {/each}

    {#each $settings.layout.homeFields as field}
        {#if field === 'callings'}
            <HeadCallings />

        {:else if field === 'covenant'}
            <HeadCovenant />

        {:else if field === 'gold'}
            {#if !isPublic}
                <RowGold {gold} />
            {/if}

        {:else if field === 'keystone'}
            {#if !isPublic || $settings.privacy.publicMythicPlus}
                <td>Keystone</td>
            {/if}

        {:else if field === 'lockouts'}
            {#if !isPublic || $settings.privacy.publicLockouts}
                <HeadLockouts />
            {/if}

        {:else if field === 'mountSpeed'}
            <HeadMount />

        {:else if field === 'playedTime'}
            {#if !isPublic}
                <RowPlayedTime {playedTotal} />
            {/if}

        {:else if field === 'professions'}
            <td>Professions</td>

        {:else if field === 'restedExperience'}
            {#if !isPublic}
                <td>Rest</td>
            {/if}

        {:else if field === 'torghast'}
            <HeadTorghast />

        {:else if field === 'vaultMythicPlus'}
            <td>M+ Vault</td>

        {:else if field === 'vaultPvp'}
            <td>PvP Vault</td>

        {:else if field === 'vaultRaid'}
            <td>Raid Vault</td>

        {:else if field === 'weeklyAnima'}
            {#if !isPublic || $settings.privacy.publicQuests}
                <td>Anima</td>
            {/if}

        {:else if field === 'weeklyKorthia'}
            {#if !isPublic || $settings.privacy.publicQuests}
                <td>Korthia</td>
            {/if}

        {:else if field === 'weeklySouls'}
            {#if !isPublic || $settings.privacy.publicQuests}
                <td>Souls</td>
            {/if}

        {:else}
            <td>&nbsp;</td>

        {/if}
    {/each}
</tr>
