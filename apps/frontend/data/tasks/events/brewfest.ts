import { Holiday } from '@/enums/holiday';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventBrewfest: Task = {
    key: 'eventBrewfest',
    name: '[Event] Brewfest',
    shortName: 'Brew',
    minimumLevel: 1,
    showSeparate: true,
    requiredHolidays: [Holiday.Brewfest],
    chores: [
        {
            key: 'corenDirebrewFirst',
            name: 'Coren Direbrew First Kill',
            accountWide: true,
            alwaysStarted: true,
            questReset: DbResetType.Daily,
            questIds: [77775],
        },
        {
            key: 'corenDirebrew',
            name: 'Coren Direbrew',
            alwaysStarted: true,
            questReset: DbResetType.Daily,
            progressFunc: (char) => {
                const lockout = char.lockouts?.['200287-1'];
                return { have: lockout?.locked ? 1 : 0, need: 1 };
            },
        },
        {
            key: 'banquet',
            name: 'Brewfest Banquet',
            alwaysStarted: true,
            questReset: DbResetType.Daily,
            questIds: [90118], // 91959?
        },
    ],
};
