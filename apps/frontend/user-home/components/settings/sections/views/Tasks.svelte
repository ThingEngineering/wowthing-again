<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { multiTaskMap, taskList, taskMap } from '@/data/tasks'
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'
    import Multi from './TasksMulti.svelte'

    export let active: boolean
    export let view: SettingsView

    const multiTasks = sortBy(Object.keys(multiTaskMap), (key) => key)

    const taskChoices: SettingsChoice[] = taskList.map((t) => ({ id: t.key, name: t.name }))
</script>

<style lang="scss">
    .tasks {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
</style>

<div class="settings-block tasks">
    <h3>
        Tasks
        {#if !active}
            <span>add to Home columns to configure</span>
        {/if}
    </h3>

    {#if active}
        <MagicLists
            key='lockouts'
            choices={taskChoices}
            bind:activeStringIds={view.homeTasks}
        />
    {/if}
</div>

{#each multiTasks as taskKey}
    {#if taskMap[taskKey] && view.homeTasks.indexOf(taskKey) >= 0}
        <div class="settings-block">
            <div>
                <h3>{taskMap[taskKey].name}</h3>
                <Multi
                    multiTaskKey={taskKey}
                    {view}
                />
            </div>
        </div>
    {/if}
{/each}
