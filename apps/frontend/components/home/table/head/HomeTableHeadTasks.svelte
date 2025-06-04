<script lang="ts">
    import { multiTaskMap, taskMap } from '@/data/tasks';
    import { activeViewTasks } from '@/shared/state/activeViewTasks.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { homeState } from '@/stores/local-storage';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import Tooltip from '@/components/tooltips/task/TooltipTaskHead.svelte';

    export let sortKey: string;

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
    }
</script>

<style lang="scss">
    td {
        --scale: 0.5;

        word-spacing: -0.2ch;

        :global([data-string='exclamation']) {
            margin-left: -0.3rem;
        }
    }
</style>

{#key settingsState.activeView.id}
    {#each activeViewTasks().value as fullTaskName (fullTaskName)}
        {@const [taskName, choreName] = fullTaskName.split('|', 2)}
        {@const sortField = `task:${fullTaskName}`}
        <td
            class="sortable"
            class:sorted-by={$homeState.groupSort[sortKey] === sortField}
            data-task={taskName}
            on:click={() => setSorting(sortField)}
            on:keypress={() => setSorting(sortField)}
            use:componentTooltip={{
                component: Tooltip,
                props: {
                    fullTaskName,
                },
            }}
        >
            {#if choreName}
                <IconifyIcon
                    icon={multiTaskMap[taskName].find((chore) => chore.taskKey === choreName)?.icon}
                    scale="0.9"
                />
            {:else}
                <ParsedText text={taskMap[taskName].shortName} />
            {/if}
        </td>
    {/each}
{/key}
