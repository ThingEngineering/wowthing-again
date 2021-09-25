<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { data as settings } from '@/stores/settings'
    import { userStore } from '@/stores'
    import type {Character} from '@/types'

    import HeadCovenant from './head/HomeTableHeadCovenant.svelte'
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
    {#each $settings.layout.commonFields as _}
        <td></td>
    {/each}

    {#each $settings.layout.homeFields as field}
        {#if field === 'covenant'}
            <HeadCovenant />

        {:else if field === 'gold'}
            {#if !isPublic}
                <RowGold {gold} />
            {/if}

        {:else if field === 'keystone'}
            <td>Keystone</td>

        {:else if field === 'mountSpeed'}
            <HeadMount />

        {:else if field === 'playedTime'}
            <RowPlayedTime {playedTotal} />

        {:else if field === 'torghast'}
            <HeadTorghast />

        {:else if field === 'vaultMythicPlus'}
            <td>M+ Vault</td>

        {:else if field === 'vaultRaid'}
            <td>Raid Vault</td>

        {:else if field === 'weeklyAnima'}
            <td>Anima</td>

        {:else if field === 'weeklyKorthia'}
            <td>Korthia</td>

        {:else if field === 'weeklySouls'}
            <td>Souls</td>

        {:else}
            <td>&nbsp;</td>

        {/if}
    {/each}
</tr>
