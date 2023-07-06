<script lang="ts">
    import debounce from 'lodash/debounce'

    import { multiTaskMap } from '@/data/tasks'
    import { settingsStore } from '@/stores'
    import type { SettingsChoice } from '@/types'

    import MagicLists from '../SettingsMagicLists.svelte'

    export let multiTaskKey: string

    const taskChoices: SettingsChoice[] = multiTaskMap[multiTaskKey].map((t) => ({ key: t.taskKey, name: t.taskName }))

    const taskInactive = ($settingsStore.tasks.disabledChores?.[multiTaskKey] || [])
        .map((f) => taskChoices.filter((c) => c.key === f)[0])
        .filter(f => f !== undefined)
    const taskActive = taskChoices.filter((c) => taskInactive.indexOf(c) === -1)

    const onTaskChange = debounce(() => {
        settingsStore.update(state => {
            (state.tasks.disabledChores ||= {})[multiTaskKey] = taskInactive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<MagicLists
    key={multiTaskKey.toLowerCase()}
    onFunc={onTaskChange}
    active={taskActive}
    inactive={taskInactive}
/>
