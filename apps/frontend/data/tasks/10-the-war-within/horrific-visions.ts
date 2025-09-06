import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const twwHorrificVisions: Task = {
    key: 'twwHorrificVisions',
    name: '[TWW] Horrific Visions Revisited',
    shortName: 'Vis',
    minimumLevel: 80,
    chores: (<[number, string][]>[
        [88905, 'Kill boss'],
        [88908, '0 mask clear'],
        [88909, '1 mask clear'],
        [88910, '2 mask clear'],
        [88911, '3 mask clear'],
        [88912, '4 mask clear'],
    ]).map(([questId, name]) => ({
        key: `twwHorrific${questId}`,
        name: `[W] ${name}`,
        minimumLevel: 80,
        questIds: [questId],
        questReset: DbResetType.Weekly,
    })),
};
