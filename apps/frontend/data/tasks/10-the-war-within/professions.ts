import { warWithinProfessions } from '@/data/professions';
import type { Task } from '@/types/tasks';

import { buildProfessionChores } from '../build-profession-chores';

export const twwProfessions: Task = {
    key: 'twwProfessions',
    name: '[TWW] Professions',
    shortName: 'Pro',
    minimumLevel: 70,
    chores: buildProfessionChores(warWithinProfessions, 10, 'tww', 70),
};
