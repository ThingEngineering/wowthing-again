<script lang="ts">
    import { taskMap } from '@/data/tasks';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import { userState } from '@/user-home/state/user';

    type Props = { taskKey: string };
    let { taskKey }: Props = $props();

    let [taskName, choreName] = $derived(taskKey.split('|', 2));
    let task = $derived(taskMap[taskName]);
    let chore = $derived(task?.chores?.find((c) => c.key === choreName));
    let completed = $derived(
        ((chore?.questIds as number[]) || []).some((questId) =>
            userState.weeklyQuestIds.has(questId)
        )
    );
</script>

{#if chore}
    <div
        class:bg-success={completed}
        class:border-success={completed}
        class:bg-warn={!completed}
        class:border-warn={!completed}
        data-tooltip={chore.name}
        data-task-key={taskKey}
    >
        {#if typeof chore.icon === 'string'}
            <ParsedText text={chore.icon} />
        {:else}
            <IconifyWrapper icon={chore.icon} />
        {/if}
    </div>
{/if}
