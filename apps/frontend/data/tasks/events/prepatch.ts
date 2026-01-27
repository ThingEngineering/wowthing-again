import { Holiday } from '@/enums/holiday';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventPrepatch: Task = {
    key: 'eventMidnightPrepatch',
    name: '[Event] Midnight Prepatch',
    shortName: 'Pre',
    minimumLevel: 10,
    showSeparate: true,
    chores: [
        {
            key: 'disrupt',
            name: 'Disrupt the Call',
            minimumLevel: 10,
            requiredHolidays: [Holiday.PrepatchMidnight],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [91795], // Disrupt the Call
        },
        {
            key: 'twilight',
            name: "Twilight's Dawn",
            minimumLevel: 10,
            requiredHolidays: [Holiday.PrepatchMidnight],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [87308], // Twilight's Dawn
        },
    ],
};
