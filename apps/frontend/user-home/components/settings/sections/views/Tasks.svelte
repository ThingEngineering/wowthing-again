<script lang="ts">
    import debounce from 'lodash/debounce'

    import { taskList, taskMap } from '@/data/tasks'
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'
    import Multi from './TasksMulti.svelte'

    export let view: SettingsView

    const taskChoices: SettingsChoice[] = taskList.map((t) => ({ key: t.key, name: t.name }))

    const taskActive = view.homeTasks
        .map((f) => taskChoices.filter((c) => c.key === f)[0])
        .filter(f => f !== undefined)
    const taskInactive = taskChoices.filter((c) => taskActive.indexOf(c) === -1)

    const onTaskChange = debounce(() => {
        view.homeTasks = taskActive.map((c) => c.key)
    }, 100)
</script>

<div class="settings-block">
    <h2>Tasks</h2>

    <p>
        <code>[Holiday]</code> tasks will only show that column when that holiday is active.
        You'll also need to add <code>Tasks</code> to <code>Home columns</code> in
        <a href='#/settings/layout'>Settings->Layout</a>.
    </p>

    <MagicLists
        key='lockouts'
        onFunc={onTaskChange}
        active={taskActive}
        inactive={taskInactive}
    />
</div>

{#each ['dfChores', 'dfChores10_1_0', 'dfChores10_2_0', 'pvpBlitz', 'pvpBrawl'] as taskKey}
    {#if view.homeTasks.indexOf(taskKey) >= 0}
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
