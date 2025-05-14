import { DbResetType } from '@/shared/stores/db/enums';
import type { Chore } from '@/types/tasks';

export const eventsTurboBoost: Chore[] = [
    {
        taskKey: 'eventsTurboBoost',
        taskName: '[W] Turbo Boost',
        minimumLevel: 80,
        questIds: [91205],
        questReset: DbResetType.Weekly,
    },
];
