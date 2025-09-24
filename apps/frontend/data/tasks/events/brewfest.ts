import { Holiday } from '@/enums/holiday';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventBrewfest: Task = {
    key: 'eventBrewfest',
    name: '[Event] Brewfest',
    shortName: 'Brew',
    minimumLevel: 1,
    requiredHolidays: [Holiday.Brewfest],
    chores: [
        {
            key: 'corenDirebrewFirst',
            name: 'Coren Direbrew First Kill',
            accountWide: true,
            questReset: DbResetType.Daily,
            questIds: [77775],
        },
    ],
};
