<script lang='ts'>
    import debounce from 'lodash/debounce'

    import { multiTaskMap, taskList } from '@/data/tasks'
    import { settingsStore } from '@/stores'
    import type { SettingsChoice } from '@/types'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import MagicLists from '../SettingsMagicLists.svelte'
 
    const taskChoices: SettingsChoice[] = taskList.map((t) => ({ key: t.key, name: t.name }))

    const taskActive = $settingsStore.layout.homeTasks
        .map((f) => taskChoices.filter((c) => c.key === f)[0])
        .filter(f => f !== undefined)
    const taskInactive = taskChoices.filter((c) => taskActive.indexOf(c) === -1)

    const onTaskChange = debounce(() => {
        settingsStore.update(state => {
            state.layout.homeTasks = taskActive.map((c) => c.key)
            return state
        })
    }, 100)

    // Dragonflight Chores
    const dfChoreChoices: SettingsChoice[] = multiTaskMap.dfChores.map((t) => ({ key: t.taskKey, name: t.taskName }))

    const dfChoreInactive = ($settingsStore.tasks.disabledChores?.dfChores || [])
        .map((f) => dfChoreChoices.filter((c) => c.key === f)[0])
        .filter(f => f !== undefined)
    const dfChoreActive = dfChoreChoices.filter((c) => dfChoreInactive.indexOf(c) === -1)

    const onDfChoreChange = debounce(() => {
        settingsStore.update(state => {
            (state.tasks.disabledChores ||= {})['dfChores'] = dfChoreInactive.map((c) => c.key)
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

    <h3>Dragonflight Settings</h3>

    <CheckboxInput
        bind:value={$settingsStore.tasks.dragonflightTreatises}
        name="tasks_dragonflightTreatises"
    >
        Show Treatises in Profession Weeklies.
    </CheckboxInput>

    <h3>Dragonflight Chores</h3>

    <MagicLists
        key='dragonflight-chore'
        onFunc={onDfChoreChange}
        active={dfChoreActive}
        inactive={dfChoreInactive}
    />
</div>
