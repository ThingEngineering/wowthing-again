<script lang="ts">
    import { getContext } from 'svelte'

    import { Constants } from '@/data/constants'
    import { data as settings } from '@/stores/settings'
    import type { Character } from '@/types'

    import RowUghQuest from './RowUghQuest.svelte'

    const character: Character = getContext('character')
    const anima = character.weekly?.ughQuests?.['anima']
    const shapingFate = character.weekly?.ughQuests?.['shapingFate']
    const souls = character.weekly?.ughQuests?.['souls']
</script>

{#if $settings.home.showWeeklyAnima}
    {#if character.level === Constants.characterMaxLevel && anima}
        <RowUghQuest icon={Constants.icons.weeklyAnima} ughQuest={anima} cls="anima" />
    {:else}
        <td></td>
    {/if}
{/if}

{#if $settings.home.showWeeklyShapingFate}
    {#if character.level === Constants.characterMaxLevel && shapingFate}
        <RowUghQuest icon={Constants.icons.weeklyShapingFate} ughQuest={shapingFate} />
    {:else}
        <td></td>
    {/if}
{/if}

{#if $settings.home.showWeeklySouls}
    {#if character.level === Constants.characterMaxLevel && souls}
        <RowUghQuest icon={Constants.icons.weeklySouls} ughQuest={souls} />
    {:else}
        <td></td>
    {/if}
{/if}
