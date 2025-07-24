<script lang="ts">
    import { multiTaskMap } from '@/data/tasks';
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons/ui';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { lazyStore } from '@/stores';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/task/TooltipTaskChore.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    type Props = CharacterProps & {
        choreName: string;
        taskName: string;
    };
    let { character, choreName, taskName }: Props = $props();

    let lazyCharacter = $derived($lazyStore.characters[character.id]);
    let chore = $derived(
        lazyCharacter.chores[
            `${settingsState.activeView.id}|${choreName ? `${taskName}|${choreName}` : taskName}`
        ]
    );

    let inProgress = $derived.by(
        () =>
            chore &&
            multiTaskMap[taskName] &&
            chore.tasks?.every((taskData) => {
                const oof = (multiTaskMap[taskName] || []).filter(
                    (multi) => multi?.taskName === taskData?.name
                )[0];
                return oof?.noProgress === true || taskData?.status > 0;
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

{#if chore?.countTotal === 0}
    <td
        class="sized b-l status-fail"
        data-chore={choreName}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                chore,
                taskName,
            },
        }}
    >
        ---
    </td>
{:else if chore?.tasks?.length > 0}
    {@const notStarted = chore.countTotal - chore.countCompleted - chore.countStarted}
    <td
        class="sized b-l"
        class:status-fail={!inProgress && notStarted > 0}
        class:status-shrug={inProgress ||
            (notStarted === 0 && chore.countCompleted < chore.countTotal)}
        class:status-success={chore.status === QuestStatus.Completed}
        class:ready={chore.anyReady}
        data-chore={choreName}
        data-task={taskName}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                chore,
                taskName,
            },
        }}
    >
        {#if multiTaskMap[taskName]?.length === 1 || choreName}
            {#if chore.status === QuestStatus.Completed}
                <IconifyIcon icon={uiIcons.starFull} />
            {:else if chore.countCompleted === chore.countTotal}
                <IconifyIcon icon={uiIcons.question} scale="0.75" />
            {:else if !inProgress}
                <IconifyIcon icon={uiIcons.starEmpty} />
            {:else}
                {chore.countCompleted} / {chore.countTotal}
            {/if}
        {:else if chore.countTotal === 1 && chore.status !== QuestStatus.InProgress}
            {#if chore.countCompleted === 0}
                Get!
            {:else}
                Done
            {/if}
        {:else}
            {chore.countCompleted} / {chore.countTotal}
        {/if}
    </td>
{:else}
    <td class="sized b-l"></td>
{/if}
