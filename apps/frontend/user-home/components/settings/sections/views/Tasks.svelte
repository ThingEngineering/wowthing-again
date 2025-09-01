<script lang="ts">
    import { taskList } from '@/data/tasks';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import TaskOptions from './TaskOptions.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    let taskFilter = $state('');

    let taskChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];

        for (const customTask of settingsState.value.customTasks || []) {
            ret.push({ id: customTask.key, name: `[Custom] ${customTask.name}` });
        }

        for (const task of taskList) {
            ret.push({ id: task.key, name: task.name });
            if (task.showSeparate && task.chores.length > 1) {
                for (const chore of task.chores.filter((c) => !!c)) {
                    ret.push({
                        id: `${task.key}|${chore.key}`,
                        name: `${task.name} - ${chore.name}`,
                    });
                }
            }
        }

        return ret;
    });
</script>

<style lang="scss">
    .tasks {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
</style>

{#if active}
    <div class="settings-block tasks">
        <h3>Tasks</h3>

        <div class="magic-filter">
            <TextInput
                name="tasks_filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={taskFilter}
            />
        </div>

        <MagicLists
            key="lockouts"
            choices={taskChoices}
            filter={taskFilter}
            bind:activeStringIds={view.homeTasks}
        />
    </div>

    {#each taskList as task (task.key)}
        {#if task.chores.length > 1 && view.homeTasks.indexOf(task.key) >= 0}
            <div class="settings-block">
                <div>
                    <h3>{task.name}</h3>
                    <TaskOptions bind:view {task} />
                </div>
            </div>
        {/if}
    {/each}
{/if}
