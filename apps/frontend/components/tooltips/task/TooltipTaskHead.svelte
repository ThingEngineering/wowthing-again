<script lang="ts">
    import { QuestStatus } from '@/enums/quest-status';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import type { Chore, Task } from '@/types/tasks';
    import type { CharacterTask } from '@/user-home/state/user/types/tasks.svelte';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    type Props = {
        chore: Chore;
        fullTaskName: string;
        task: Task;
    };
    let { chore, fullTaskName, task }: Props = $props();

    // TODO: get title from character quests?

    let disabledChores = $derived(settingsState.activeView.disabledChores?.[fullTaskName] || []);

    let { choreStats, overallStats } = $derived.by(() => {
        const choreStats: Record<string, Record<QuestStatus, number>> = {};
        const overallStats = { completed: 0, inProgress: 0, needToGet: 0, total: 0 };

        const doChore = (characterTask: CharacterTask, choreKey: string) => {
            const characterChore = characterTask.chores[choreKey];
            if (!characterChore) {
                return;
            }

            const stats = (choreStats[choreKey] ||= { 0: 0, 1: 0, 2: 0, 3: 0 });
            overallStats.total++;

            if (characterChore?.status === QuestStatus.Completed) {
                stats[QuestStatus.Completed]++;
                overallStats.completed++;
            } else if (characterChore?.status === QuestStatus.InProgress) {
                stats[QuestStatus.InProgress]++;
                overallStats.inProgress++;
            } else {
                stats[QuestStatus.NotStarted]++;
            }
        };

        for (const characterTasks of Object.values(userState.activeViewTasks)) {
            const characterTask = characterTasks[task.key];
            if (!characterTask) {
                continue;
            }

            if (chore) {
                doChore(characterTask, chore.key);
            } else {
                for (const chore of task.chores.filter((c) => !!c)) {
                    doChore(characterTask, chore.key);
                }
            }
        }

        overallStats.needToGet =
            overallStats.total - overallStats.inProgress - overallStats.completed;

        return { choreStats, overallStats };
    });
</script>

<style lang="scss">
    .label {
        text-align: right;
    }
    .value {
        --image-border-width: 1px;

        text-align: left;
    }
    .faded {
        opacity: 0.7;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{task.name}</h4>
    <table class="table-striped">
        <tbody>
            {#each task.chores.filter((c) => !!c) as taskChore (taskChore.key)}
                {@const disabled = disabledChores.indexOf(taskChore.key) >= 0}
                {@const questStatuses = choreStats[taskChore.key]}
                {#if questStatuses && Object.values(questStatuses).reduce((a, b) => a + b, 0) > 0 && (!disabled || questStatuses[1] > 0 || questStatuses[2] > 0)}
                    <tr class:faded={disabled}>
                        <td class="value">
                            <ParsedText text={taskChore.name} />
                        </td>
                        <td class="label status-fail">{questStatuses[0]}</td>
                        <td class="label status-shrug">{questStatuses[1]}</td>
                        <td class="label status-success">{questStatuses[2]}</td>
                    </tr>
                {/if}
            {:else}
                <tr>
                    <td class="label status-success">Completed:</td>
                    <td class="value">{overallStats.completed}</td>
                </tr>
                {#if overallStats.inProgress > 0}
                    <tr>
                        <td class="label status-shrug">In progress:</td>
                        <td class="value">{overallStats.inProgress}</td>
                    </tr>
                {/if}
                {#if overallStats.needToGet > 0}
                    <tr>
                        <td class="label status-fail">Not started:</td>
                        <td class="value">{overallStats.needToGet}</td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>
