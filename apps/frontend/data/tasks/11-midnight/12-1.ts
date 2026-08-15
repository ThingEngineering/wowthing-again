import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import { nthActiveQuest } from '@/utils/tasks/nth-active-quest';
import type { Task } from '@/types/tasks';

import { specialAssignmentFunc } from './12-0';

const specialAssignmentUnlocks = [
    96492, // Special Assignment: Demand and Supply
    96029, // Special Assignment: Face the Swarm
    96307, // Special Assignment: Wraith Wrath
];

const vaultDailies = [
    96639, // Patrolling the Temple
    96641, // Relentless Strikes
    96642, // Decisive Incursions
    96643, // From Whence it Came
    98419, // Shoulder to Shoulder
    98420, // What's Out There?
];

export const midChores12_1: Task = {
    key: 'midChores12_1',
    name: '[Mid] 12.1.x',
    shortName: '12.1',
    showSeparate: true,
    chores: [
        {
            key: 'trailing',
            name: "Trailing Xal'atath",
            icon: iconLibrary.mdiFootPrint,
            minimumLevel: 90,
            questReset: DbResetType.Weekly,
            questIds: [98172],
        },
        {
            key: 'curseSurge',
            name: 'Curse Surges',
            icon: iconLibrary.gameCursedStar,
            minimumLevel: 90,
            questReset: DbResetType.Weekly,
            questIds: [96995],
        },
        {
            key: 'purgingVaults',
            name: 'Purging the Vaults',
            icon: iconLibrary.mdiSafeSquareOutline,
            minimumLevel: 90,
            questReset: DbResetType.Weekly,
            questIds: [95520],
        },
        {
            key: 'vaultDailies',
            name: 'Vault Dailies',
            icon: iconLibrary.emojiDoubleExclamationMark,
            minimumLevel: 90,
            alwaysStarted: true,
            subChoresAnyOrder: true,
            questReset: DbResetType.Daily,
            questResetForced: true,
            subChores: [
                {
                    key: 'daily1',
                    name: 'Daily 1',
                    showQuestName: true,
                    questIds: nthActiveQuest(vaultDailies, 0),
                },
                {
                    key: 'daily2',
                    name: 'Daily 2',
                    showQuestName: true,
                    questIds: nthActiveQuest(vaultDailies, 1),
                },
            ],
        },
        {
            key: 'specialAssignment',
            name: 'Special Assignment',
            icon: ':island:',
            minimumLevel: 90,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            subChores: [
                {
                    key: 'unlock',
                    name: 'World Quests',
                    alwaysStarted: true,
                    overrideNeed: 3,
                    questIds: specialAssignmentFunc(specialAssignmentUnlocks, 0, false),
                },
                {
                    key: 'assignment',
                    name: 'Assignment',
                    alwaysStarted: true,
                    showQuestName: true,
                    overrideNeed: 1,
                    questIds: specialAssignmentFunc(specialAssignmentUnlocks, 0, true),
                },
            ],
        },
    ],
};
