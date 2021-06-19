<script lang="ts">
    import sumBy from 'lodash/sumBy'

    import { data as settings } from '@/stores/settings'
    import { data as userData } from '@/stores/user'
    import type {Character} from '@/types'
    import getCharacterTableSpan from '@/utils/get-character-table-span'

    import RowGold from '@/components/character-table/row/Gold.svelte'
    import SpacerRow from '@/components/character-table/SpacerRow.svelte'

    export let group: Character[]
    export let groupIndex: number

    console.log(groupIndex, group)

    let gold: number
    $: {
        gold = sumBy(group, (c: Character) => c.gold)
    }

    const span = getCharacterTableSpan()
</script>

<style lang="scss">
    tr {
        :global(td) {
            background: adjust-color($active-background, $alpha: -0.5); //rgba(255, 0, 0, 0.25);
            font-size: 1.05rem;
        }
    }
    td {
        text-align: center;
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
    {#if $settings.home.showMountSkill}
        <td colspan="2">?</td>
    {/if}
    {#if $settings.home.showCovenant}
        <td colspan="2">Cov</td>
    {/if}
    {#if $settings.home.showWeeklyAnima}
        <td colspan="2">Anima</td>
    {/if}
    {#if $settings.home.showWeeklySouls}
        <td colspan="2">Souls</td>
    {/if}
    {#if $settings.home.showKeystone}
        <td colspan="3">Keystone</td>
    {/if}
    {#if $settings.home.showVault}
        <td colspan="3">M+ Vault</td>
    {/if}
    {#if $settings.home.showStatuses && $userData.public === false}
        <td>&nbsp;</td>
    {/if}
    <td>&nbsp;</td>
</tr>
