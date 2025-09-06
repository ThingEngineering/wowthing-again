import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const twwChores11_1_5: Task = {
    key: 'twwChores11_1_5',
    name: '[TWW] 11.1.5',
    shortName: 'Rad',
    minimumLevel: 10,
    showSeparate: true,
    chores: [
        {
            key: 'twwNightfall',
            name: 'Nightfall Scenario',
            icon: iconLibrary.gameNightSky,
            minimumLevel: 80,
            questIds: [91173], // seems like the only consistent one
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwRadiant1',
            name: 'Incursion 1',
            minimumLevel: 80,
            showQuestName: true,
            questIds: [
                87480, // Sureki Incursion: The Eastern Assault
                88945, // Radiant Incursion: Rak-Zakaz
            ],
            questReset: DbResetType.Daily,
        },
        {
            key: 'twwRadiant2',
            name: 'Incursion 2',
            minimumLevel: 80,
            questIds: [
                87477, // Sureki Incursion: Southern Swarm
                88916, // Radiant Incursion: Sureki's End
            ],
            questReset: DbResetType.Daily,
        },
        {
            key: 'twwRadiant3',
            name: 'Incursion 3',
            minimumLevel: 80,
            questIds: [
                87475, // Sureki Incursion: Hold the Wall
                88711, // Radiant Incursion: Toxins and Pheromones
            ],
            questReset: DbResetType.Daily,
        },
        {
            key: 'twwWindsSatchel',
            name: 'Winds Satchel',
            minimumLevel: 10,
            questIds: [86695],
            questReset: DbResetType.Daily,
            couldGetFunc: (char) => char.level < 80,
        },
    ],
};
