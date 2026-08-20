import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const midVeteranCaches: Task = {
    key: 'midVeteranCaches',
    name: '[MID] Veteran Caches',
    shortName: 'Vet',
    minimumLevel: 90,
    chores: [93790, 93793].map((questId, index) => ({
        key: `cache${index}`,
        name: `{item:260193} #${index + 1}`, // Fabled Veteran's Cache
        alwaysStarted: true,
        questIds: [questId],
        questReset: DbResetType.Weekly,
        questResetForced: true,
    })),
};
