import { holidayIds } from '@/data/holidays';
import { taskMap } from '@/data/tasks';
import { settingsState } from '@/shared/state/settings.svelte';
import { logErrors } from '@/utils/log-errors';
import type { Chore, Task } from '@/types/tasks';

import { activeHolidays } from './activeHolidays.svelte';

class ActiveViewTasks {
    value = $derived.by(() => logErrors(this._value));

    private _value() {
        const customTaskMap = $state.snapshot(settingsState.customTaskMap) as Record<string, Task>;

        const activeTasks: string[] = [];

        for (const fullTaskName of settingsState.activeView.homeTasks) {
            const [taskName, choreName] = fullTaskName.split('|', 2);
            const task = taskMap[taskName] || customTaskMap[fullTaskName];
            if (!task || (choreName && !task.chores.some((chore) => chore.key === choreName))) {
                continue;
            }

            // Any task with required holidays needs at least one active
            if (
                task.requiredHolidays?.length > 0 &&
                !task.requiredHolidays.some((holiday) =>
                    holidayIds[holiday].some((holidayId) => activeHolidays.value[`h${holidayId}`])
                )
            ) {
                continue;
            }

            const disabledChores = settingsState.activeView.disabledChores?.[fullTaskName] || [];
            const activeChores: Chore[] = [];
            for (const chore of task.chores) {
                if (!chore || disabledChores.includes(chore.key)) {
                    continue;
                }

                if (chore.requiredHolidays?.length > 0) {
                    if (
                        chore.requiredHolidays.some((holiday) =>
                            holidayIds[holiday].some(
                                (holidayId) => !!activeHolidays.value[`h${holidayId}`]
                            )
                        )
                    ) {
                        activeChores.push(chore);
                    }
                } else {
                    activeChores.push(chore);
                }
            }

            if (
                activeChores.length === 0 ||
                (activeChores.length === 1 && activeChores[0].noAlone)
            ) {
                continue;
            }

            activeTasks.push(fullTaskName);
        }

        return activeTasks;
    }
}

export const activeViewTasks = new ActiveViewTasks();
