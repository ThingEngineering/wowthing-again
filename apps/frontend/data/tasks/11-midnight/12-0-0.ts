import { Constants } from '@/data/constants';
import { aliasedIcons, iconLibrary } from '@/shared/icons';
import { timeState } from '@/shared/state/time.svelte';
import { DbResetType } from '@/shared/stores/db/enums';
import { worldQuestStore } from '@/user-home/components/world-quests/store';
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
        const now = timeState.slowTime;
        const allWorldQuests = worldQuestStore.getCachedQuests(char.region);
        const questIdIndexes = Object.fromEntries(
            allWorldQuests
                .filter((worldQuest) => worldQuest.expires > now)
                .map((worldQuest, index) => [worldQuest.questId, index])
        );

        const activeQuests = specialAssignmentUnlocks
            .filter((questId) => questIdIndexes[questId])
            .map((questId) => [questIdIndexes[questId], questId]);
        activeQuests.sort((a, b) => a[0] - b[0]);

        if (activeQuests[index]) {
            return [
                isQuest
                    ? specialAssignmentUnlockToQuest[activeQuests[index][1]]
                    : activeQuests[index][1],
            ];
        } else {
            return specialAssignmentUnlocks;
        }
    };
};

const specialAssignmentExpiry: Chore['customExpiryFunc'] = (char, scannedAt, questIds) => {
    const allWorldQuests = worldQuestStore.getCachedQuests(char.region);
    const worldQuest = allWorldQuests.find((wq) => wq.questId === questIds[0]);
    return worldQuest?.expires || Constants.defaultTime;
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
            questReset: DbResetType.Weekly,
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
                    showQuestName: true,
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
            key: 'midAbundance',
            name: 'Abundance',
            icon: iconLibrary.gameTwirlyFlower,
            minimumLevel: 80,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            questIds: [89507],
        },
        {
            key: 'midSoiree',
            name: 'Soiree',
            icon: iconLibrary.mdiPartyPopper,
            minimumLevel: 80,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            questIds: [
                90573, // Fortify the Runestones: Magisters
                90574, // Fortify the Runestones: Blood Knights
                90575, // Fortify the Runestones: Farstriders
                90576, // Fortify the Runestones: Shades of the Row                        { quest = 89507 }, -- Abundant Offerings
            ],
        },
        {
            key: 'midStormarion',
            name: 'Stormarion',
            icon: iconLibrary.gameTeslaTurret,
            minimumLevel: 80,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            questIds: [90962],
        },
        {
            key: 'midResearch',
            name: 'Void Research',
            icon: iconLibrary.gameFizzingFlask,
            minimumLevel: 80,
            showQuestName: true,
            questReset: DbResetType.Weekly,
            questIds: [94790],
        },
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
                    questIds: specialAssignmentFunc(0, false),
                    customExpiryFunc: specialAssignmentExpiry,
                },
                {
                    key: 'assignment',
                    name: 'Assignment',
                    alwaysStarted: true,
                    showQuestName: true,
                    questIds: specialAssignmentFunc(0, true),
                    customExpiryFunc: specialAssignmentExpiry,
                },
            ],
        },
        {
            key: 'midSpecial2',
            name: 'Special Assignment 2',
            icon: iconLibrary.mdiNumeric2CircleOutline,
            showQuestName: true,
            questReset: DbResetType.Custom,
            customExpiryFunc: specialAssignmentExpiry,
            subChores: [
                {
                    key: 'unlock',
                    name: 'World Quests',
                    alwaysStarted: true,
                    overrideNeed: 3,
                    questIds: specialAssignmentFunc(1, false),
                    customExpiryFunc: specialAssignmentExpiry,
                },
                {
                    key: 'assignment',
                    name: 'Assignment',
                    alwaysStarted: true,
                    showQuestName: true,
                    questIds: specialAssignmentFunc(1, true),
                    customExpiryFunc: specialAssignmentExpiry,
                },
            ],
        },
        {
            key: 'midLostLegends',
            name: 'Lost Legends',
            icon: iconLibrary.gameSecretBook,
            minimumLevel: 83,
            accountWide: true,
            questReset: DbResetType.Weekly,
            questIds: [89268],
        },
        {
            key: 'midDungeon',
            name: 'Dungeon',
            icon: iconLibrary.faDungeon,
            minimumLevel: 90,
            accountWide: true,
            showQuestName: true,
            questResetForced: true,
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
        {
            key: 'midWorldBossFirst',
            name: 'World Boss (First)',
            icon: iconLibrary.emojiZzz,
            minimumLevel: 90,
            accountWide: true,
            questReset: DbResetType.Weekly,
            questIds: [
                92127,
                92128,
                92129, // probably
                92130,
            ],
        },
        {
            key: 'midWorldBoss',
            name: 'World Boss',
            icon: iconLibrary.emojiZzz,
            minimumLevel: 90,
            questReset: DbResetType.Weekly,
            questIds: [
                // TODO from AreaPOI.db2, verify
                92123, // Cragpine
                92560, // Lu'ashal
                92636, // Predaxas
                92034, // Thorm'belan
            ],
        },
        // 94446, A Nightmarish Task, weekly?
    ],
};
