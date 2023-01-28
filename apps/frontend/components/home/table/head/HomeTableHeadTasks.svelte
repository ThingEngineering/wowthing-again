<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { settingsStore, userStore } from '@/stores'
    import { getActiveHoliday } from '@/utils/get-active-holiday'
    import { tippyComponent } from '@/utils/tippy'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import Tooltip from '@/components/tooltips/task/TooltipTaskHead.svelte'

    let activeHoliday: string
    $: {
        const firstRegion = $userStore.allRegions?.[0] || 1
        activeHoliday = getActiveHoliday($userStore, firstRegion)
    }
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

{#each $settingsStore.layout.homeTasks as taskName}
    {@const task = taskMap[taskName]}
    {#if task}
        {#if
            task.name.indexOf('[Holiday]') === -1
            || taskName === activeHoliday
            || (taskName === 'timewalking' && activeHoliday === 'holidayTimewalking')
        }
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
    {/if}
{/each}
