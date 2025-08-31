import type { Task } from '@/types/tasks';

import { twwTasks } from './10-the-war-within';

export const taskList: Task[] = [...twwTasks];

export const taskMap: Record<string, Task> = Object.fromEntries(
    taskList.map((task) => [task.key, task])
);

export const taskChoreMap = Object.fromEntries(
    taskList
        .filter((task) => task.chores.length > 1)
        .flatMap((task) =>
            task.chores
                .filter((chore) => !!chore)
                .map((chore) => [`${task.key}_${chore.key}`, chore])
        )
);
