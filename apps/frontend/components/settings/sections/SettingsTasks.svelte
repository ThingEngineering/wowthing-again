<script lang='ts'>
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'

    import { taskList } from '@/data/tasks'
    import { data as settingsData } from '@/stores/settings'
    import type { SettingsChoice } from '@/types'

    import MagicLists from '../SettingsMagicLists.svelte'
 
    const taskChoices: SettingsChoice[] = [...taskList]

    const taskActive = $settingsData.layout.homeTasks.map(
        (f) => filter(taskChoices, (c) => c.key === f)[0]
    ).filter(f => f !== undefined)
    const taskInactive = filter(taskChoices, (c) => taskActive.indexOf(c) < 0)

    const onTaskChange = debounce(() => {
        settingsData.update(state => {
            state.layout.homeTasks = taskActive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<div class='thing-container settings-container'>
    <h2>Tasks</h2>

    <p>
        <code>Holiday</code> tasks will only show that column when that holiday is active.
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
