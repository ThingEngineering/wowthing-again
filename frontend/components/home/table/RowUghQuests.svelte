<script lang="ts">
    import { Constants } from '@/data/constants'
    import { data as settings } from '@/stores/settings'
    import type {Character, CharacterWeeklyUghQuest} from '@/types'

    import RowUghQuest from './RowUghQuest.svelte'

    export let character: Character

    let anima: CharacterWeeklyUghQuest
    let shapingFate: CharacterWeeklyUghQuest
    let souls: CharacterWeeklyUghQuest
    $: {
        anima = character.weekly?.ughQuests?.['anima']
        shapingFate = character.weekly?.ughQuests?.['shapingFate']
        souls = character.weekly?.ughQuests?.['souls']
    }
</script>

{#if $settings.home.showWeeklyAnima}
    <RowUghQuest
        {character}
        icon={Constants.icons.weeklyAnima}
        ughQuest={anima}
        cls="anima"
    />
{/if}

{#if $settings.home.showWeeklyShapingFate}
    <RowUghQuest
        {character}
        icon={Constants.icons.weeklyShapingFate}
        ughQuest={shapingFate}
    />
{/if}

{#if $settings.home.showWeeklySouls}
    <RowUghQuest
        {character}
        icon={Constants.icons.weeklySouls}
        ughQuest={souls}
        weeklyReset={true}
    />
{/if}
