<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { settingsStore, userStore } from '@/stores'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import type { Character } from '@/types'

    import RowDmfProfessions from './HomeTableRowDmfProfessions.svelte'
    import RowProgressQuest from './HomeTableRowProgressQuest.svelte'
    import RowTaskChores from './HomeTableRowTaskChores.svelte'

    export let character: Character

    $: activeHoliday = getActiveHoliday($userStore.data, character.realm.region)
</script>

{#each $settingsStore.layout.homeTasks as taskName}
    {@const task = taskMap[taskName]}
    {#if task}
        {#if taskName === 'dmfProfessions'}
            <RowDmfProfessions {character} />
        {:else if taskMap[taskName]?.type === 'multi'}
            <RowTaskChores
                {character}
                {taskName}
            />
        {:else if !taskName.startsWith('holiday') || taskName === activeHoliday}
            <RowProgressQuest
                {character}
                quest={taskName}
            />
        {/if}

        {#if taskName === activeHoliday && taskName === 'holidayTimewalking'}
            <RowProgressQuest
                {character}
                quest={'timewalking'}
            />
        {/if}
    {/if}
{/each}
