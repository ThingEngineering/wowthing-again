<script lang="ts">
    import { taskMap } from '@/data/tasks';
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';
    import type { CharacterProps } from '@/types/props';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Tooltip from '@/components/tooltips/task/TooltipTaskRow.svelte';

    type Props = CharacterProps & {
        choreName: string;
        fullTaskName: string;
        taskName: string;
    };
    let { character, choreName, fullTaskName, taskName }: Props = $props();

    let task = $derived(taskMap[taskName] || settingsState.customTaskMap[taskName]);
    let charChore = $derived(
        userState.activeViewTasks[character.id]?.[fullTaskName]?.chores?.[choreName]
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

<td
    class="sized b-l"
    class:ready={charChore?.status === QuestStatus.InProgress &&
        charChore.progressCurrent === charChore.progressTotal}
    data-task={taskName}
    data-chore={choreName}
    use:componentTooltip={{
        component: Tooltip,
        propsFunc: () => ({
            character,
            charChore,
            task,
            taskName,
        }),
    }}
>
    {#if charChore?.status === QuestStatus.Completed}
        <IconifyIcon icon={uiIcons.starFull} extraClass="status-success" />
        <!-- {:else if charChore.countCompleted === charTask.countTotal}
        <IconifyIcon icon={uiIcons.question} scale="0.75" /> -->
    {:else if charChore?.status === QuestStatus.InProgress}
        <span class="status-shrug">
            {charChore.progressCurrent} / {charChore.progressTotal}
        </span>
    {:else}
        <IconifyIcon icon={uiIcons.starEmpty} extraClass="status-fail" />
    {/if}
</td>
