<script lang="ts">
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import type { Character } from '@/types'

    import RowDmfProfessions from './HomeTableRowDmfProfessions.svelte';
    import RowProgressQuest from './HomeTableRowProgressQuest.svelte'

    export let character: Character

    $: activeHoliday = getActiveHoliday($userStore.data)
</script>

{#each $settings.layout.homeTasks as task}
    {#if task === 'dmfProfessions'}
        <RowDmfProfessions {character} />
    {:else if !task.startsWith('holiday') || task === activeHoliday}
        <RowProgressQuest
            {character}
            quest={task}
        />
    {/if}
{/each}
