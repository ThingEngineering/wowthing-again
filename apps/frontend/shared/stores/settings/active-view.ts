import { location } from 'svelte-spa-router';
import { derived, type Readable } from 'svelte/store';

import { browserStore } from '../browser';
import { settingsStore } from './store';
import type { SettingsView } from './types';

export const activeView: Readable<SettingsView> = derived(
    [browserStore, location, settingsStore],
    ([$browserStore, $location, $settingsStore]) => {
        return (
            ($location === '/'
                ? $settingsStore.views.find((view) => view.id === $browserStore.home.activeView)
                : $settingsStore.views[0]) || $settingsStore.views[0]
        );
    },
);
