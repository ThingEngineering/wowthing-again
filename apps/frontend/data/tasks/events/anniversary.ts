import { Holiday } from '@/enums/holiday';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventAnniversary: Task = {
    key: 'eventAnniversary',
    name: '[Event] Anniversary',
    requiredHolidays: [Holiday.Anniversary],
    shortName: 'Anni',
    minimumLevel: 10,
    showSeparate: true,
    chores: [
        {
            key: 'trivia',
            name: 'Trivia',
            minimumLevel: 10,
            icon: iconLibrary.mdiChatQuestionOutline,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [
                43323, // A
                43461, // H
            ],
        },
        {
            key: 'codex',
            name: "Chromie's Codex",
            minimumLevel: 10,
            questReset: DbResetType.Weekly,
            questIds: [82783],
        },
        {
            key: 'worldBosses',
            name: 'World Bosses',
            minimumLevel: 30,
            questReset: DbResetType.Weekly,
            questIds: [
                47254, // The Originals
                60215, // Timely Gate Crashers
            ],
        },
    ],
};
