import { Holiday } from '@/enums/holiday';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventNoblegarden: Task = {
    key: 'eventNoblegarden',
    name: '[Event] Noblegarden',
    shortName: '🐰',
    minimumLevel: 1,
    requiredHolidays: [Holiday.Noblegarden],
    chores: [
        {
            key: 'featheredFiend',
            name: 'Feathered Fiend',
            icon: iconLibrary.mdiDuck,
            alwaysStarted: true,
            questResetForced: true,
            questReset: DbResetType.Daily,
            questIds: [
                73192, // [A]
                79558, // [H]
            ],
        },
    ],
};
