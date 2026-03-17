<script lang="ts">
    import { QuestStatus } from '@/enums/quest-status';
    import { uiIcons } from '@/shared/icons';
    import { userState } from '@/user-home/state/user';
    import { toNiceNumber } from '@/utils/formatting/to-nice-number';
    import type { CharacterProps } from '@/types/props';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    type Props = CharacterProps & {
        choreName: string;
        fullTaskName: string;
    };
    let { character, choreName, fullTaskName }: Props = $props();

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
    class="b-l tooltip-task"
    class:ready={charChore?.status === QuestStatus.InProgress &&
        charChore.progressCurrent === charChore.progressTotal}
    data-character-id={character.id}
    data-full-task-name={fullTaskName}
>
    {#if charChore?.status === QuestStatus.Completed}
        <IconifyWrapper icon={uiIcons.starFull} cls="status-success" />
        <!-- {:else if charChore.countCompleted === charTask.countTotal}
        <IconifyWrapper icon={uiIcons.question} scale="0.75" /> -->
    {:else if charChore?.status === QuestStatus.InProgress}
        <span class="status-shrug">
            {toNiceNumber(charChore.progressCurrent, 0)} / {toNiceNumber(
                charChore.progressTotal,
                0
            )}
        </span>
    {:else if charChore?.status === QuestStatus.NotStarted}
        <IconifyWrapper icon={uiIcons.starEmpty} cls="status-fail" />
    {/if}
</td>
