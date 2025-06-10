import { get } from 'svelte/store';

import { holidayIds } from '@/data/holidays';
import { multiTaskMap, taskMap } from '@/data/tasks';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { lazyStore } from '@/stores';
import type { Chore } from '@/types/tasks';

import { activeHolidays } from './activeHolidays.svelte';

class ActiveViewTasks {
    value = $derived.by(() => {
        const lazyStoreValue = get(lazyStore);

        const activeTasks: string[] = [];
        const choreKeys = new Set(
            Object.values(lazyStoreValue.characters).flatMap((c) => Object.keys(c.chores))
        );
        const taskKeys = new Set(
            Object.values(lazyStoreValue.characters).flatMap((c) => Object.keys(c.tasks))
        );

        for (const fullTaskName of settingsState.activeView.homeTasks) {
            const [taskName] = fullTaskName.split('|', 2);
            const task = taskMap[taskName];
            if (!task) {
                continue;
            }

            const taskViewKey = `${settingsState.activeView.id}|${fullTaskName}`;

            if (!choreKeys.has(taskViewKey) && !taskKeys.has(taskViewKey)) {
                continue;
            }

            if (!activeHolidays.value[taskName] && wowthingData.static.holidayIds.get(taskName)) {
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
                                    (holidayId) => activeHolidays.value[`h${holidayId}`]
                                )
                            )
                        ) {
                            activeChores.push(chore);
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
}

export const activeViewTasks = new ActiveViewTasks();
