<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { timeStore, userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { activeView, settingsStore } from '@/shared/stores/settings'
    import { getActiveHolidays } from '@/utils/get-active-holidays'
    import type { Character } from '@/types'

    import RowDmfProfessions from './HomeTableRowDmfProfessions.svelte'
    import RowProgressQuest from './HomeTableRowProgressQuest.svelte'
    import RowTaskChores from './HomeTableRowTaskChores.svelte'

    export let character: Character

    $: activeHolidays = getActiveHolidays($timeStore, $settingsStore, ...$userStore.allRegions)
</script>

{#each $activeView.homeTasks as taskName}
    {@const task = taskMap[taskName]}
    {#if task}
        {#if taskName === 'dmfProfessions' && activeHolidays[taskName]}
            <RowDmfProfessions {character} />
        {:else if taskMap[taskName]?.type === 'multi'}
            <RowTaskChores
                {character}
                {taskName}
            />
        {:else if (
            activeHolidays[taskName] ||
            (
                $staticStore.holidayIds[taskName] === undefined &&
                taskName !== 'dmfProfessions' &&
                !taskName.startsWith('pvp')
            )
        )}
            <RowProgressQuest
                {character}
                quest={taskName}
                title={activeHolidays[taskName]?.name || taskMap[taskName]?.name}
            />
        {/if}
    {/if}
{/each}
