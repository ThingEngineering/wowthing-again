<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { data as settings } from '@/stores/settings'
    import { userStore } from '@/stores'
    import type {Character} from '@/types'
    import getCharacterTableSpan from '@/utils/get-character-table-span'

    import HeadCovenant from './head/Covenant.svelte'
    import HeadMount from './head/Mount.svelte'
    import HeadTorghast from './head/Torghast.svelte'
    import RowGold from '@/components/character-table/row/Gold.svelte'
    import SpacerRow from '@/components/character-table/CharacterTableSpacerRow.svelte'

    export let group: Character[]
    export let groupIndex: number

    let gold: number
    let isPublic: boolean
    let span: number
    $: {
        gold = sumBy(group, (c: Character) => c.gold)
        isPublic = $userStore.data.public
        span = getCharacterTableSpan()
    }
</script>

{#if groupIndex > 0}
    <SpacerRow />
{/if}

<tr class="table-group-head">
    {#each $settings.layout.commonFields as field}
        <td></td>
    {/each}

    {#each $settings.layout.homeFields as field}
        {#if field === 'covenant'}
            <HeadCovenant />

        {:else if field === 'gold'}
            <RowGold {gold} />

        {:else if field === 'keystone'}
            <td>Keystone</td>

        {:else if field === 'mountSpeed'}
            <HeadMount />

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
