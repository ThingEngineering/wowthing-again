<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { multiTaskMap, taskList, taskMap } from '@/data/tasks';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import Multi from './TasksMulti.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    export let active: boolean;
    export let view: SettingsView;

    let taskFilter: string;

    const multiTasks = sortBy(Object.keys(multiTaskMap), (key) => key);

    let taskChoices: SettingsChoice[];
    $: {
        const lowerFilter = (taskFilter || '').toLocaleLowerCase();
        taskChoices = [];
        for (const task of taskList) {
            if (!lowerFilter || task.name.toLocaleLowerCase().includes(lowerFilter)) {
                taskChoices.push({ id: task.key, name: task.name });
                if (task.showSeparate && multiTaskMap[task.key]) {
                    for (const multiTask of multiTaskMap[task.key]) {
                        taskChoices.push({
                            id: `${task.key}|${multiTask.taskKey}`,
                            name: `${task.name} - ${multiTask.taskName}`,
                        });
                    }
                }
            }
        }
    }
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

        <MagicLists key="lockouts" choices={taskChoices} bind:activeStringIds={view.homeTasks} />
    </div>

    {#each multiTasks as taskKey}
        {#if multiTaskMap[taskKey]?.length > 1 && taskMap[taskKey] && view.homeTasks.indexOf(taskKey) >= 0}
            <div class="settings-block">
                <div>
                    <h3>{taskMap[taskKey].name}</h3>
                    <Multi multiTaskKey={taskKey} {view} />
                </div>
            </div>
        {/if}
    {/each}
{/if}
