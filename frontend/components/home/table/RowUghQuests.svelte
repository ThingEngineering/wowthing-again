<script lang="ts">
    import { getContext } from 'svelte'

    import { Constants } from '@/data/constants'
    import { data as settings } from '@/stores/settings'
    import type { Character } from '@/types'

    import RowUghQuest from './RowUghQuest.svelte'
    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')
    const anima = character.weekly?.ughQuests?.['anima']
    const souls = character.weekly?.ughQuests?.['souls']
</script>

<style lang="scss">
    td {
        padding-left: 0.1rem;
        text-align: right;
        width: 2rem;
    }
</style>

{#if $settings.home.showWeeklyAnima}
    {#if character.level === Constants.characterMaxLevel && anima}
        <TableIcon>
            <WowthingImage name="spell/341209" size={20} border={1} />
        </TableIcon>
        <RowUghQuest ughQuest={anima} />
    {:else}
        <TableIcon />
        <td></td>
    {/if}
{/if}

{#if $settings.home.showWeeklySouls}
    {#if character.level === Constants.characterMaxLevel && souls}
        <TableIcon>
            <WowthingImage name="spell/225100" size={20} border={1} />
        </TableIcon>
        <RowUghQuest ughQuest={souls} />
    {:else}
        <TableIcon />
        <td></td>
    {/if}
{/if}
