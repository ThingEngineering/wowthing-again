<script lang="ts">
    import { taskMap } from '@/data/tasks';
    import { activeViewTasks } from '@/user-home/state/activeViewTasks.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { activeHolidays } from '@/stores/derived/active-holidays';
    import type { Character } from '@/types';

    import RowProgressQuest from './HomeTableRowProgressQuest.svelte';
    import RowTaskChores from './HomeTableRowTaskChores.svelte';

    export let character: Character;
</script>

{#key settingsState.activeView.id}
    {#each activeViewTasks().value as fullTaskName (fullTaskName)}
        {@const [taskName, choreName] = fullTaskName.split('|', 2)}
        {#if taskMap[taskName]?.type === 'multi'}
            <RowTaskChores {character} {taskName} {choreName} />
        {:else}
            <RowProgressQuest
                {character}
                quest={taskName}
                title={taskName.startsWith('holidayTimewalking')
                    ? taskMap[taskName]?.name
                    : $activeHolidays[taskName]?.name || taskMap[taskName]?.name}
            />
        {/if}
    {/each}
{/key}
