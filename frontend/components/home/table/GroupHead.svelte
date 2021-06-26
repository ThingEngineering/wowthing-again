<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { data as settings } from '@/stores/settings'
    import { data as userData } from '@/stores/user'
    import type {Character} from '@/types'
    import getCharacterTableSpan from '@/utils/get-character-table-span'

    import HeadCovenant from './head/Covenant.svelte'
    import HeadMount from './head/Mount.svelte'
    import RowGold from '@/components/character-table/row/Gold.svelte'
    import SpacerRow from '@/components/character-table/SpacerRow.svelte'

    export let group: Character[]
    export let groupIndex: number

    let gold: number
    let span: number
    $: {
        gold = sumBy(group, (c: Character) => c.gold)
        span = getCharacterTableSpan()
    }
</script>

<style lang="scss">
    tr {
        :global(td) {
            background: adjust-color($active-background, $alpha: -0.5);
            border-top: 1px solid $border-color;
            font-size: 1.05rem;
        }
    }
    td {
        text-align: center;

        &:first-child {
            border-top-left-radius: $border-radius;
        }
        &:last-child {
            border-top-right-radius: $border-radius;
        }
    }
</style>

{#if groupIndex > 0}
    <SpacerRow />
{/if}

<tr>
    <td colspan="{span}">&nbsp;</td>

    {#if !$userData.public}
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

    {#if $settings.home.showWeeklyAnima && $userData.public === false}
        <td colspan="2">Anima</td>
    {/if}

    {#if $settings.home.showWeeklySouls && $userData.public === false}
        <td colspan="2">Souls</td>
    {/if}

    {#if $settings.home.showKeystone}
        <td>Keystone</td>
    {/if}

    <!--{#if $settings.home.showVaultRaid}
        <td colspan="3">Raid Vault</td>
    {/if}-->

    {#if $settings.home.showVaultMythicPlus}
        <td>M+ Vault</td>
    {/if}

    <!--{#if $settings.home.showVaultPvp}
        <td colspan="3">PvP Vault</td>
    {/if}-->

    {#if $settings.home.showStatuses && $userData.public === false}
        <td>&nbsp;</td>
    {/if}

    <td>&nbsp;</td>
</tr>
