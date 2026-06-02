import { midnightProfessions } from '@/data/professions';
import type { Task } from '@/types/tasks';

import { buildProfessionChores } from '../build-profession-chores';

export const midProfessions: Task = {
    key: 'midProfessions',
    name: '[Mid] Professions',
    shortName: '🔨Mid',
    minimumLevel: 80,
    sumChores: true,
    chores: buildProfessionChores(11, midnightProfessions),
};
