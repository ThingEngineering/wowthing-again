<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { timeStore } from '@/shared/stores/time'
    import { homeState } from '@/stores/local-storage'
    import { activeView } from '@/shared/stores/settings'
    import { getActiveHolidays } from '@/utils/get-active-holidays'
    import { componentTooltip } from '@/shared/utils/tooltips'

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import Tooltip from '@/components/tooltips/task/TooltipTaskHead.svelte'

    export let sortKey: string

    $: activeHolidays = getActiveHolidays($timeStore, $activeView, ...$userStore.allRegions)

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey]
        $homeState.groupSort[sortKey] = current === column ? undefined : column
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

{#each $activeView.homeTasks as taskName}
    {@const task = taskMap[taskName]}
    {#if task && (
        activeHolidays[taskName] ||
        $staticStore.holidayIds[taskName] === undefined
    )}
        {@const sortField = `task:${taskName}`}
        <td
            class="sortable"
            class:sorted-by={$homeState.groupSort[sortKey] === sortField}
            data-task="{taskName}"
            on:click={() => setSorting(sortField)}
            on:keypress={() => setSorting(sortField)}
            use:componentTooltip={{
                component: Tooltip,
                props: {
                    taskName,
                },
            }}
        >
            <ParsedText text={taskMap[taskName].shortName} />
        </td>
    {/if}
{/each}
