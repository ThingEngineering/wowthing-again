<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { activeView } from '@/shared/stores/settings'
    import { timeStore } from '@/shared/stores/time'
    import { getActiveHolidays } from '@/utils/get-active-holidays'
    import type { Character } from '@/types'

    import RowProgressQuest from './HomeTableRowProgressQuest.svelte'
    import RowTaskChores from './HomeTableRowTaskChores.svelte'

    export let character: Character

    $: activeHolidays = getActiveHolidays($timeStore, $activeView, ...$userStore.allRegions)
</script>

{#each $activeView.homeTasks as taskName}
    {@const task = taskMap[taskName]}
    {#if task && (
        activeHolidays[taskName] ||
        $staticStore.holidayIds[taskName] === undefined
    )}
        {#if taskMap[taskName]?.type === 'multi'}
            <RowTaskChores
                {character}
                {taskName}
            />
        {:else}
            <RowProgressQuest
                {character}
                quest={taskName}
                title={activeHolidays[taskName]?.name || taskMap[taskName]?.name}
            />
        {/if}
    {/if}
{/each}
