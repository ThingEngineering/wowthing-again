import { location } from 'svelte-spa-router'
import { derived, type Readable } from 'svelte/store'

import { settingsStore } from './store'
import type { SettingsView } from './types'


export const activeView: Readable<SettingsView> = derived(
    [
        location,
        settingsStore,
    ],
    ([$location, $settingsStore]) => {
        return ($location === '/'
            ? $settingsStore.views.find((view) => view.id === $settingsStore.activeView)
            : $settingsStore.views[0]
        ) || $settingsStore.views[0]
    }
)
