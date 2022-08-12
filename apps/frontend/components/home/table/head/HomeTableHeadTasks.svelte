<script lang="ts">
    import { tasksHead } from '@/data/tasks'
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getActiveHoliday } from '@/utils/get-active-holiday'

    $: activeHoliday = getActiveHoliday($userStore.data)
</script>

{#each $settings.layout.homeTasks as task}
    {#if !task.startsWith('holiday') || task === activeHoliday}
        <td>{tasksHead[task]}</td>
    {/if}
{/each}
