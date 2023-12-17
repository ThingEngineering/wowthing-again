<script lang="ts">
    import { taskMap } from '@/data/tasks'
    import { timeStore, userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { homeState } from '@/stores/local-storage'
    import { settingsStore } from '@/shared/stores/settings'
    import { getActiveHolidays } from '@/utils/get-active-holidays'
    import { componentTooltip } from '@/shared/utils/tooltips'

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import Tooltip from '@/components/tooltips/task/TooltipTaskHead.svelte'

    export let groupIndex: number

    $: activeHolidays = getActiveHolidays($timeStore, $settingsStore, ...$userStore.allRegions)

    function setSorting(column: string) {
        const current = $homeState.groupSort[groupIndex]
        $homeState.groupSort[groupIndex] = current === column ? undefined : column
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
    {#if task && (
        activeHolidays[taskName] ||
        ($staticStore.holidayIds[taskName] === undefined && (
            !taskName.startsWith('pvp') ||
            taskName === 'pvpBlitz'
        ))
    )}
        {@const sortKey = `task:${taskName}`}
        <td
            class="sortable"
            class:sorted-by={$homeState.groupSort[groupIndex] === sortKey}
            data-task="{taskName}"
            on:click={() => setSorting(sortKey)}
            on:keypress={() => setSorting(sortKey)}
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
