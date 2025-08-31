import { get } from 'svelte/store';

import { holidayIds } from '@/data/holidays';
import { taskMap } from '@/data/tasks';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { lazyStore } from '@/stores';
import { logErrors } from '@/utils/log-errors';
import type { SettingsTask } from '@/shared/stores/settings/types/task';
import type { Chore } from '@/types/tasks';

import { activeHolidays } from './activeHolidays.svelte';

class ActiveViewTasks {
    value = $derived.by(() => logErrors(this._value));

    private _value() {
        const customTaskMap = $state.snapshot(settingsState.customTaskMap) as Record<
            string,
            SettingsTask
        >;

        const activeTasks: string[] = [];

        for (const fullTaskName of settingsState.activeView.homeTasks) {
            const [taskName] = fullTaskName.split('|', 2);
            const task = taskMap[taskName]; // || customTaskMap[fullTaskName]; // FIXME
            if (!task) {
                continue;
            }

            const taskViewKey = `${settingsState.activeView.id}|${fullTaskName}`;

            if (!activeHolidays.value[taskName] && wowthingData.static.holidayIds.get(taskName)) {
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
        }

        return activeTasks;
    }
}

export const activeViewTasks = new ActiveViewTasks();
