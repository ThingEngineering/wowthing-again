import { DbResetType } from '@/shared/stores/db/enums';
import type { Chore } from '@/types/tasks';

export const eventsTurboBoost: Chore[] = [
    {
        taskKey: 'eventsTurboBoost',
        taskName: '[W] Turbo Boost',
        minimumLevel: 80,
        questIds: [
            89039, // Turbo-Boost: Powerhouse Challenges
            91205, // Ultra Prime Deluxe Turbo-Boost: Powerhouse Challenges
        ],
        questReset: DbResetType.Weekly,
    },
];
