<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import type { Character } from '@/types'

    import RowDmfProfessions from './HomeTableRowDmfProfessions.svelte'
    import RowProgressQuest from './HomeTableRowProgressQuest.svelte'

    export let character: Character

    $: activeHoliday = getActiveHoliday($userStore.data, character.realm.region)
</script>

{#each $settings.layout.homeTasks as taskName}
    {@const task = taskMap[taskName]}
    {#if task}
        {#if taskName === 'dmfProfessions'}
            <RowDmfProfessions {character} />
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
