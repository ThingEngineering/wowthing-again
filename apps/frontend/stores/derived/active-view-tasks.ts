import { derived } from 'svelte/store';

import { activeHolidays } from './active-holidays';
import { holidayIds } from '@/data/holidays';
import { multiTaskMap, taskMap } from '@/data/tasks';
import { settingsState } from '@/shared/state/settings.svelte';
import { staticStore } from '@/shared/stores/static';
import { lazyStore } from '@/stores/lazy';
import type { Chore } from '@/types/tasks';

export const activeViewTasks = derived(
    [activeHolidays, lazyStore, staticStore],
    ([$activeHolidays, $lazyStore, $staticStore]) => {
        console.time('activeViewTasks');

        const activeTasks: string[] = [];
        const choreKeys = new Set(
            Object.values($lazyStore.characters).flatMap((c) => Object.keys(c.chores)),
        );
        const taskKeys = new Set(
            Object.values($lazyStore.characters).flatMap((c) => Object.keys(c.tasks)),
        );

        for (const fullTaskName of settingsState.activeView.homeTasks) {
            const [taskName, choreName] = fullTaskName.split('|', 2);
            const task = taskMap[taskName];
            if (!task) {
                continue;
            }

            const taskViewKey = `${settingsState.activeView.id}|${fullTaskName}`;

            if (!choreKeys.has(taskViewKey) && !taskKeys.has(taskViewKey)) {
                continue;
            }

            if (!$activeHolidays[taskName] && $staticStore.holidayIds[taskName]) {
                continue;
            }

            if (task.type === 'multi') {
                const disabledChores =
                    settingsState.activeView.disabledChores?.[fullTaskName] || [];
                const activeChores: Chore[] = [];
                for (const chore of multiTaskMap[task.key]) {
                    if (!chore || disabledChores.includes(chore.taskKey)) {
                        continue;
                    }

                    if (chore.requiredHolidays?.length > 0) {
                        if (
                            chore.requiredHolidays.some((holiday) =>
                                holidayIds[holiday].some(
                                    (holidayId) => $activeHolidays[`h${holidayId}`],
                                ),
                            )
                        ) {
                            activeChores.push(chore);
                            // meow
                        }
                    } else {
                        activeChores.push(chore);
                    }
                }

                if (activeChores.length === 1 && activeChores[0].noAlone) {
                    continue;
                }

                activeTasks.push(fullTaskName);
            } else {
                activeTasks.push(fullTaskName);
            }
        }

        console.timeEnd('activeViewTasks');
        return activeTasks;
    },
);
