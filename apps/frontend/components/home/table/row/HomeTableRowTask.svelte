<script lang="ts">
    import { taskMap } from '@/data/tasks';
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons/ui';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';
    import type { CharacterProps } from '@/types/props';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Tooltip from '@/components/tooltips/task/TooltipTaskRow.svelte';

    type Props = CharacterProps & {
        taskName: string;
    };
    let { character, taskName }: Props = $props();

    let task = $derived(taskMap[taskName] || settingsState.customTaskMap[taskName]);
    let charTask = $derived(userState.activeViewTasks[character.id]?.[taskName]);

    let inProgress = $derived(
        charTask &&
            Object.values(charTask.chores).every((charChore) => {
                const oof = task.chores.find((chore) => chore.key === charChore.key);
                return oof?.noProgress === true || charChore?.status > 0;
            })
    );
</script>

<style lang="scss">
    td {
        --width: $width-weekly-quest;

        text-align: center;
        word-spacing: -0.2ch;
    }
    .ready {
        box-shadow: inset 0 0 0 1px var(--color-shrug);
    }
</style>

{#if charTask?.countTotal === 0}
    <td
        class="sized b-l status-fail"
        data-task={taskName}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                charTask,
                task,
                taskName,
            },
        }}
    >
        ---
    </td>
{:else if Object.keys(charTask?.chores || {}).length > 0}
    {@const notStarted = charTask.countTotal - charTask.countCompleted - charTask.countStarted}
    <td
        class="sized b-l"
        class:status-fail={!inProgress && notStarted > 0}
        class:status-shrug={inProgress ||
            (notStarted === 0 && charTask.countCompleted < charTask.countTotal)}
        class:status-success={charTask.status === QuestStatus.Completed}
        class:ready={charTask.anyReady}
        data-task={taskName}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                charTask,
                task,
                taskName,
            },
        }}
    >
        {#if task.chores.length === 1}
            {#if charTask.status === QuestStatus.Completed}
                <IconifyIcon icon={uiIcons.starFull} />
            {:else if charTask.countCompleted === charTask.countTotal}
                <IconifyIcon icon={uiIcons.question} scale="0.75" />
            {:else if !inProgress}
                <IconifyIcon icon={uiIcons.starEmpty} />
            {:else}
                {charTask.countCompleted} / {charTask.countTotal}
            {/if}
        {:else if charTask.countTotal === 1 && charTask.status !== QuestStatus.InProgress}
            {#if charTask.countCompleted === 0}
                Get!
            {:else}
                Done
            {/if}
        {:else}
            {charTask.countCompleted} / {charTask.countTotal}
        {/if}
    </td>
{:else}
    <td class="sized b-l"></td>
{/if}
