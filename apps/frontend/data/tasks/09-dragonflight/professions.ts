import { dragonflightProfessions } from '@/data/professions';
import type { Task } from '@/types/tasks';

import { buildProfessionChores } from '../build-profession-chores';

export const dfProfessions: Task = {
    key: 'dfProfessions',
    name: '[DF] Professions',
    shortName: '🔨DF',
    minimumLevel: 70,
    chores: buildProfessionChores(9, dragonflightProfessions),
};
