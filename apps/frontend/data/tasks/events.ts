import { DbResetType } from '@/shared/stores/db/enums';
import type { Chore, Task } from '@/types/tasks';

export const eventsTurboBoost: Chore[] = [
    {
        key: 'eventsTurboBoost',
        name: '[W] Turbo Boost',
        minimumLevel: 80,
        questIds: [
            89039, // Turbo-Boost: Powerhouse Challenges
            91205, // Ultra Prime Deluxe Turbo-Boost: Powerhouse Challenges
        ],
        questReset: DbResetType.Weekly,
    },
];

export const eventGreedyEmissaryTask: Task = {
    key: 'greedyEmissary',
    name: '[Event] Greedy Emissary',
    shortName: ':devil:',
    type: 'multi',
};

export const eventGreedyEmissaryChores: Chore[] = [
    91079, 91080, 91081, 91082, 91083, 91166, 91167, 91168, 91169, 91170,
].map((questId, index) => ({
    taskKey: `emissaryBox${index + 1}`,
    taskName: `Box #${index + 1}`,
    accountWide: true,
    minimumLevel: 10,
    questIds: [questId],
    questReset: DbResetType.Daily,
}));
