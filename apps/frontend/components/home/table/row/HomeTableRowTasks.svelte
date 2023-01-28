<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { settingsStore, userStore } from '@/stores'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import type { Character } from '@/types'

    import RowDmfProfessions from './HomeTableRowDmfProfessions.svelte'
    import RowProgressQuest from './HomeTableRowProgressQuest.svelte'
    import RowTaskChores from './HomeTableRowTaskChores.svelte'

    export let character: Character

    $: activeHoliday = getActiveHoliday($userStore, character.realm.region)
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
        {:else if
            task.name.indexOf('[Holiday]') === -1
            || taskName === activeHoliday
            || (taskName === 'timewalking' && activeHoliday === 'holidayTimewalking')
        }
            <RowProgressQuest
                {character}
                quest={taskName}
            />
        {/if}
    {/if}
{/each}
