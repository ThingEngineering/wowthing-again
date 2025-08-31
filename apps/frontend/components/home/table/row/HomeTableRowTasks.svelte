<script lang="ts">
    import { taskMap } from '@/data/tasks';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { activeHolidays } from '@/stores/derived/active-holidays';
    import { activeViewTasks } from '@/user-home/state/activeViewTasks.svelte';
    import type { CharacterProps } from '@/types/props';

    import RowProgressQuest from './HomeTableRowProgressQuest.svelte';
    import RowTask from './HomeTableRowTask.svelte';

    let { character }: CharacterProps = $props();
</script>

{#key settingsState.activeView.id}
    {#each activeViewTasks.value as fullTaskName (fullTaskName)}
        {@const [taskName, choreName] = fullTaskName.split('|', 2)}
        <!-- {#if taskMap[taskName]?.type === 'multi'} -->
        <RowTask {character} {taskName} {choreName} />
        <!-- {:else}
            <RowProgressQuest
                {character}
                quest={taskName}
                title={taskName.startsWith('holidayTimewalking')
                    ? taskMap[taskName]?.name
                    : $activeHolidays[taskName]?.name || taskMap[taskName]?.name}
            /> -->
        <!-- {/if} -->
    {/each}
{/key}
