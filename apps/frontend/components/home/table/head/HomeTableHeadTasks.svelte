<script lang="ts">
    import { taskMap } from '@/data/tasks';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { timeState } from '@/shared/state/time.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { activeViewTasks } from '@/user-home/state/activeViewTasks.svelte';
    import { userState } from '@/user-home/state/user';
    import type { SortableProps } from '@/types/props';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Tooltip from '@/components/tooltips/task/TooltipTaskHead.svelte';

    let { getSortState, setSortState }: SortableProps = $props();

    let activeTasks = $derived(activeViewTasks.value);
</script>

<style lang="scss">
    td {
        --scale: 0.5;

        word-spacing: -0.2ch;

        :global([data-string='exclamation']) {
            margin-left: -0.3rem;
        }
    }
    .decorator-warn {
        box-shadow: inset 0 0 5px 3px color-mix(in hsl, var(--color-warn) 75%, #000);
    }
    .decorator-shrug {
        box-shadow: inset 0 0 5px 3px color-mix(in hsl, var(--color-shrug) 75%, #000);
    }
    .decorator-success {
        box-shadow: inset 0 0 5px 3px color-mix(in hsl, var(--color-success) 75%, #000);
    }
</style>

{#each activeTasks as fullTaskName (fullTaskName)}
    {@const [taskName, choreName] = fullTaskName.split('|', 2)}
    {@const task = taskMap[taskName] || settingsState.customTaskMap[fullTaskName]}
    {@const chore = task.chores.find((task) => task?.key === choreName)}
    {@const customExpiry = chore?.decorationFunc?.(
        chore?.customExpiryFunc(userState.general.characters[0], timeState.time)
    )}

    <td
        class="sortable sorted-{getSortState(fullTaskName)} {customExpiry || ''}"
        data-task={taskName}
        onclick={() => setSortState(fullTaskName)}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                chore,
                fullTaskName,
                task,
            },
        }}
    >
        {#if chore}
            <IconifyIcon icon={chore?.icon} scale="0.9" />
        {:else}
            <ParsedText text={task.shortName} />
        {/if}
    </td>
{/each}
