import { slTasks } from './08-shadowlands';
import { twwTasks } from './10-the-war-within';
import { eventTasks } from './events';
import { pvpTasks } from './pvp';
import type { Task } from '@/types/tasks';

export const taskList: Task[] = [...eventTasks, ...pvpTasks, ...slTasks, ...twwTasks];

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
