import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const twwVeteranCaches: Task = {
    key: 'twwVeteranCaches',
    name: '[TWW] Veteran Caches',
    shortName: 'Vet',
    minimumLevel: 80,
    chores: [91179, 91180].map((questId, index) => ({
        key: `cache${index}`,
        name: `{item:244865} #${index + 1}`, // Pinnacle Cache
        noProgress: true,
        questIds: [questId],
        questReset: DbResetType.Weekly,
    })),
};
