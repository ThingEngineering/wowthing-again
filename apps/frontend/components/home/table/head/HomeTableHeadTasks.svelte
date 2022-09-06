<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import { tippyComponent } from '@/utils/tippy'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import Tooltip from '@/components/tooltips/task/TooltipTaskHead.svelte'

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

{#each $settings.layout.homeTasks as taskName}
    {#if !taskName.startsWith('holiday') || taskName === activeHoliday}
        <td
            use:tippyComponent={{
                component: Tooltip,
                props: {
                    taskName,
                },
            }}
        >
            <ParsedText text={taskMap[taskName].shortName} />
        </td>
    {/if}

    {#if taskName === activeHoliday && taskName === 'holidayTimewalking'}
        <td
            use:tippyComponent={{
                component: Tooltip,
                props: {
                    taskName: 'timewalking',
                },
            }}
        >
            <ParsedText text={taskMap['timewalking'].shortName} />
        </td>
    {/if}
{/each}
