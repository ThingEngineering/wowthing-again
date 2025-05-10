import { location } from 'svelte-spa-router';
import { derived, type Readable } from 'svelte/store';

import { browserStore } from '../browser';
import { settingsStore } from './store';
import type { SettingsView } from './types';
import { taskMap } from '@/data/tasks';
import { lazyStore } from '@/stores';
import { staticStore } from '../static';

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

// export const activeViewChores: Readable<string[]> = derived(
//     [activeView, lazyStore, settingsStore, staticStore],
//     ([$activeView, $lazyStore, $settingsStore]) => {
//         const activeTasks: string[] = [];

//         for (const taskName of $activeView.homeTasks) {
//             const task = taskMap[taskName];
//             if (!task) {
//                 continue;
//             }

//             if (
//                 !Object.values($lazyStore.characters).some(
//                     (char) => char.chores[`${$activeView.id}|${taskName}`],
//                 )
//             ) {
//                 continue;
//             }

//             if (!activeHolidays[taskName] && $staticStore.holidayIds[taskName]) {
//                 continue;
//             }
//             }

//         return activeTasks;
//     },
// );
