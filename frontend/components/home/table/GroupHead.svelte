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
    <td colspan="{span}">&nbsp;</td>

    {#if !isPublic}
        <RowGold {gold} />
    {/if}

    {#if $settings.general.showItemLevel}
        <td>&nbsp;</td>
    {/if}

    {#if $settings.home.showMountSpeed}
        <HeadMount />
    {/if}

    {#if $settings.home.showCovenant}
        <HeadCovenant />
    {/if}

    {#if $settings.home.showWeeklyAnima && !isPublic}
        <td>Anima</td>
    {/if}

    {#if $settings.home.showWeeklyShapingFate && !isPublic}
        <td>Shaping</td>
    {/if}

    {#if $settings.home.showWeeklySouls && !isPublic}
        <td>Souls</td>
    {/if}

    {#if $settings.home.showTorghast}
        <HeadTorghast />
    {/if}

    {#if $settings.home.showKeystone}
        <td>Keystone</td>
    {/if}

    {#if $settings.home.showVaultMythicPlus}
        <td>M+ Vault</td>
    {/if}

    {#if $settings.home.showVaultRaid}
        <td>Raid Vault</td>
    {/if}

    <!--{#if $settings.home.showVaultPvp}
        <td colspan="3">PvP Vault</td>
    {/if}-->

    {#if $settings.home.showStatuses && !isPublic}
        <td>&nbsp;</td>
    {/if}
</tr>
