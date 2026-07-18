import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums/db-reset-type';
import type { Task } from '@/types/tasks';

export const dfEvents: Task = {
    key: 'dfEvents',
    name: '[DF] Events',
    shortName: 'Dig',
    showSeparate: true,
    chores: [
        {
            key: 'bigDig',
            name: 'Big Dig',
            icon: iconLibrary.gameDigDug,
            minimumLevel: 60,
            questReset: DbResetType.Weekly,
            questIds: [79226],
        },
    ],
};
