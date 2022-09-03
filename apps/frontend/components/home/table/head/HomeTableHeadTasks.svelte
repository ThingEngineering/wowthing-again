<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getActiveHoliday } from '@/utils/get-active-holiday'

    import ParsedText from '@/components/common/ParsedText.svelte'

    $: activeHoliday = getActiveHoliday($userStore.data)
</script>

<style lang="scss">
    td {
        --scale: 0.5;

        word-spacing: -0.2ch;

        :global([data-string="exclamation"]) {
            margin-left: -0.3rem;
        }
    }
</style>

{#each $settings.layout.homeTasks as task}
    {#if !task.startsWith('holiday') || task === activeHoliday}
        <td>
            <ParsedText text={taskMap[task].shortName} />
        </td>
    {/if}

    {#if task === activeHoliday && task === 'holidayTimewalking'}
        <td>
            <ParsedText text={taskMap['timewalking'].shortName} />
        </td>
    {/if}
{/each}
