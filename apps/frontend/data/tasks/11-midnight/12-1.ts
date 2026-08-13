import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Chore, Task } from '@/types/tasks';

import { specialAssignmentExpiry, specialAssignmentFunc } from './12-0';

const specialAssignmentUnlocks = [
    96492, // Special Assignment: Demand and Supply
    96029, // Special Assignment: Face the Swarm
    96307, // Special Assignment: Wraith Wrath
];

export const midChores12_1: Task = {
    key: 'midChores12_1',
    name: '[Mid] 12.1.x',
    shortName: '12.1',
    showSeparate: true,
    chores: [
        {
            key: 'midSpecial1',
            name: 'Special Assignment 1',
            icon: iconLibrary.mdiNumeric1CircleOutline,
            showQuestName: true,
            questReset: DbResetType.Custom,
            customExpiryFunc: specialAssignmentExpiry,
            subChores: [
                {
                    key: 'unlock',
                    name: 'World Quests',
                    alwaysStarted: true,
                    overrideNeed: 3,
                    questIds: specialAssignmentFunc(specialAssignmentUnlocks, 0, false),
                    customExpiryFunc: specialAssignmentExpiry,
                },
                {
                    key: 'assignment',
                    name: 'Assignment',
                    alwaysStarted: true,
                    showQuestName: true,
                    questIds: specialAssignmentFunc(specialAssignmentUnlocks, 0, true),
                    customExpiryFunc: specialAssignmentExpiry,
                },
            ],
        },
    ],
};
