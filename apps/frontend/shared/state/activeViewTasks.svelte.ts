import { get } from 'svelte/store';

import { multiTaskMap, taskMap } from '@/data/tasks';
import { staticStore } from '@/shared/stores/static';
import { activeHolidays } from '@/stores/derived/active-holidays';
import { lazyStore } from '@/stores';
import { settingsState } from './settings.svelte';
import type { Chore } from '@/types/tasks';
import { holidayIds } from '@/data/holidays';

export const activeViewTasks = () => {
    const tasks = $derived.by(() => {
        const activeHolidaysValue = get(activeHolidays);
        const lazyStoreValue = get(lazyStore);
        const staticStoreValue = get(staticStore);

        const activeTasks: string[] = [];
        const choreKeys = new Set(
            Object.values(lazyStoreValue.characters).flatMap((c) => Object.keys(c.chores))
        );
        const taskKeys = new Set(
            Object.values(lazyStoreValue.characters).flatMap((c) => Object.keys(c.tasks))
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

            if (!activeHolidaysValue[taskName] && staticStoreValue.holidayIds[taskName]) {
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
                                    (holidayId) => activeHolidaysValue[`h${holidayId}`]
                                )
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

        return activeTasks;
    });

    return {
        get value() {
            return tasks;
        },
    };
};
