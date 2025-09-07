import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const slCovenants: Task = {
    key: 'slCovenants',
    name: '[SL] Covenants',
    shortName: 'Cov',
    showSeparate: true,
    chores: [
        {
            key: 'venthyrEmberCourt',
            name: 'Venthyr: Ember Court',
            questIds: [
                61616, // first?
                61526, // second?
                61525, // third+?
                60339, // honored?
            ],
            questReset: DbResetType.Daily,
        },
    ],
};
