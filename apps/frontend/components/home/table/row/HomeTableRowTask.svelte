<script lang="ts">
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons/ui';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { lazyStore } from '@/stores';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/task/TooltipTaskChore.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import { taskMap } from '@/data/tasks';

    type Props = CharacterProps & {
        choreName: string;
        taskName: string;
    };
    let { character, choreName, taskName }: Props = $props();

    let task = $derived(taskMap[taskName]);

    let lazyCharacter = $derived($lazyStore.characters[character.id]);
    let charTask = $derived(
        lazyCharacter.chores[
            `${settingsState.activeView.id}|${choreName ? `${taskName}|${choreName}` : taskName}`
        ]
    );
    let inProgress = false;

    // let inProgress = $derived(
    //     charTask &&
    //         charTask.tasks?.every((taskData) => {
    //             const oof = (multiTaskMap[taskName] || []).filter(
    //                 (multi) => multi?.name === taskData?.name
    //             )[0];
    //             return oof?.noProgress === true || taskData?.status > 0;
    //         })
    // );
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
        data-chore={choreName}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                chore: charTask,
                taskName,
            },
        }}
    >
        ---
    </td>
{:else if charTask?.tasks?.length > 0}
    {@const notStarted = charTask.countTotal - charTask.countCompleted - charTask.countStarted}
    <td
        class="sized b-l"
        class:status-fail={!inProgress && notStarted > 0}
        class:status-shrug={inProgress ||
            (notStarted === 0 && charTask.countCompleted < charTask.countTotal)}
        class:status-success={charTask.status === QuestStatus.Completed}
        class:ready={charTask.anyReady}
        data-chore={choreName}
        data-task={taskName}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                chore: charTask,
                taskName,
            },
        }}
    >
        {#if task.chores.length === 1 || choreName}
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
