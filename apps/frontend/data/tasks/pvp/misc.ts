import { Constants } from '@/data/constants';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const pvpMisc: Task = {
    key: 'pvpMisc',
    name: '[PvP] Training Grounds',
    shortName: '🚂',
    minimumLevel: Constants.characterMaxLevel,
    chores: [
        {
            key: 'pvpFirstTraining',
            name: 'First Training Ground',
            questIds: [94788],
            questReset: DbResetType.Daily,
        },
    ],
};
