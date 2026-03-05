import { Constants } from '@/data/constants';
import { aliasedIcons, iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import { userState } from '@/user-home/state/user';
import type { Character } from '@/types';
import type { Chore, Task } from '@/types/tasks';

const specialAssignmentUnlocks = [
    94865, // Special Assignment: What Remains of a Temple Broken
    94866, // Special Assignment: Ours Once More!
    94390, // Special Assignment: A Hunter's Regret
    95435, // Special Assignment: Shade and Claw
    92848, // Special Assignment: The Grand Magister's Drink
    94391, // Special Assignment: Push Back the Light
    94795, // Special Assignment: Agents of the Shield
    94743, // Special Assignment: Precision Excision
];

const specialAssignmentUnlockToQuest: Record<number, number> = {
    94865: 91390, // Special Assignment: What Remains of a Temple Broken
    94866: 91796, // Special Assignment: Ours Once More!
    94390: 92063, // Special Assignment: A Hunter's Regret
    95435: 92139, // Special Assignment: Shade and Claw
    92848: 92145, // Special Assignment: The Grand Magister's Drink
    94391: 93013, // Special Assignment: Push Back the Light
    94795: 93244, // Special Assignment: Agents of the Shield
    94743: 93438, // Special Assignment: Precision Excision
};

const specialAssignmentFunc = (index: number, isQuest: boolean) => {
    return (char: Character, chore: Chore) => {
        const charQuests = userState.quests.characterById.get(char.id);
        const completedOrInProgress = specialAssignmentUnlocks.filter(
            (questId) =>
                charQuests.hasQuestById.has(questId) ||
                charQuests.progressQuestByKey.has(`q${questId}`)
        );

        if (completedOrInProgress[index]) {
            return [
                isQuest
                    ? specialAssignmentUnlockToQuest[completedOrInProgress[index]]
                    : completedOrInProgress[index],
            ];
        } else {
            return specialAssignmentUnlocks;
        }
    };
};

export const midChores12_0_0: Task = {
    key: 'midChores12_0',
    name: '[Mid] 12.0.x',
    shortName: '12.0',
    showSeparate: true,
    chores: [
        {
            key: 'midHopeUnity',
            name: 'Hope/Unity',
            icon: aliasedIcons.planet,
            subChoresAnyOrder: true,
            subChores: [
                {
                    key: 'hope',
                    name: 'Hope in the Darkest Corners',
                    minimumLevel: 80,
                    maximumLevel: 89,
                    icon: iconLibrary.gameCandleLight,
                    questReset: DbResetType.Weekly,
                    questIds: [95468],
                },
                {
                    key: 'unity',
                    name: 'Unity',
                    minimumLevel: 90,
                    icon: aliasedIcons.planet,
                    questReset: DbResetType.Weekly, // TODO: weird 3 week garbage?
                    questIds: [
                        93890, // Midnight: Abundance
                        93767, // Midnight: Arcantina
                        94457, // Midnight: Battlegrounds
                        93909, // Midnight: Delves
                        93911, // Midnight: Dungeons
                        93769, // Midnight: Housing
                        93891, // Midnight: Legends of the Haranir
                        93910, // Midnight: Prey
                        93912, // Midnight: Raid
                        93889, // Midnight: Saltheril's Soiree
                        93892, // Midnight: Stormarion Assault
                        93913, // Midnight: World Boss
                        93766, // Midnight: World Quests
                    ],
                },
            ],
        },
        // {
        //     key: 'midDelves',
        //     name: '[Dor] Delves',
        //     minimumLevel: 80,
        //     icon: iconLibrary.gameDigDug,
        //     questReset: DbResetType.Weekly,
        //     questIds: [
        //         93909, // Delves: Worldwide Research
        //     ],
        // },
        {
            key: 'midSpecial1',
            name: 'Special Assignment 1',
            icon: iconLibrary.mdiNumeric1CircleOutline,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            subChores: [
                {
                    key: 'unlock',
                    name: 'World Quests',
                    questResetForced: true,
                    questIds: specialAssignmentFunc(0, false),
                },
                {
                    key: 'assignment',
                    name: 'Assignment',
                    alwaysStarted: true,
                    showQuestName: true,
                    questResetForced: true,
                    questIds: specialAssignmentFunc(0, true),
                },
            ],
        },
        {
            key: 'midSpecial2',
            name: 'Special Assignment 2',
            icon: iconLibrary.mdiNumeric2CircleOutline,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            subChores: [
                {
                    key: 'unlock',
                    name: 'World Quests',
                    questResetForced: true,
                    questIds: specialAssignmentFunc(1, false),
                },
                {
                    key: 'assignment',
                    name: 'Assignment',
                    alwaysStarted: true,
                    showQuestName: true,
                    questResetForced: true,
                    questIds: specialAssignmentFunc(1, true),
                },
            ],
        },
        {
            key: 'midDungeon',
            name: 'Dungeon',
            minimumLevel: Constants.characterMaxLevel,
            accountWide: true,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            questIds: [
                93751, // Windrunner Spire
                93752, // Murder Row
                93753, // Magisters' Terrace
                93754, // Maisara Caverns
                93755, // Den of Nalorakk
                93756, // The Blinding Vale
                93757, // Voidscar Arena
                93758, // Nexus-Point Xenas
            ],
        },
        // 94446, A Nightmarish Task, weekly?
    ],
};
