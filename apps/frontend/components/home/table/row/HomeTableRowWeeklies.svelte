<script lang="ts">
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import type { Character } from '@/types'

    import RowProgressQuest from './HomeTableRowProgressQuest.svelte'

    export let character: Character

    $: activeHoliday = getActiveHoliday($userStore.data)
</script>

{#each $settings.layout.homeWeeklies as weekly}
    {#if !weekly.startsWith('holiday') || weekly === activeHoliday}
        <RowProgressQuest
            {character}
            quest={weekly}
        />
    {/if}
{/each}
