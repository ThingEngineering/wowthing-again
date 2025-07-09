<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { multiTaskMap, taskList, taskMap } from '@/data/tasks';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import Multi from './TasksMulti.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    const multiTasks = sortBy(Object.keys(multiTaskMap), (key) => key);

    let taskFilter = $state('');

    let taskChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];

        for (const customTask of settingsState.value.customTasks || []) {
            ret.push({ id: customTask.key, name: `[Custom] ${customTask.name}` });
        }

        for (const task of taskList) {
            ret.push({ id: task.key, name: task.name });
            if (task.showSeparate && multiTaskMap[task.key]) {
                for (const multiTask of multiTaskMap[task.key].filter((t) => !!t)) {
                    ret.push({
                        id: `${task.key}|${multiTask.taskKey}`,
                        name: `${task.name} - ${multiTask.taskName}`,
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

    {#each multiTasks as taskKey (taskKey)}
        {#if multiTaskMap[taskKey]?.length > 1 && taskMap[taskKey] && view.homeTasks.indexOf(taskKey) >= 0}
            <div class="settings-block">
                <div>
                    <h3>{taskMap[taskKey].name}</h3>
                    <Multi multiTaskKey={taskKey} bind:view />
                </div>
            </div>
        {/if}
    {/each}
{/if}
