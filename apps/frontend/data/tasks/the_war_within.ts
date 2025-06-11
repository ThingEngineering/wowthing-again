import { get } from 'svelte/store';

import { customResetPeriod } from './custom-reset-period';
import { QuestStatus } from '@/enums/quest-status';
import { aliasedIcons, iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import { userQuestStore, userStore } from '@/stores';
import type { Character } from '@/types';
import type { Chore } from '@/types/tasks';
import { userState } from '@/user-home/state/user';

export const twwChores11_0: Chore[] = [
    {
        taskKey: 'twwEmissaryArchives',
        taskName: '[Dor] Archives',
        minimumLevel: 70,
        icon: aliasedIcons.bookshelf,
        // questIds: [
        //     82679, // Archives: Seeking History
        //     82678, // Archives: The First Disc
        // ],
        questIdFunc: (char) =>
            userQuestStore.characterHas(char.id, 83450)
                ? [82679] // Archives: Seeking History
                : [82678], // Archives: The First Disc
        questReset: DbResetType.Custom,
        customExpiryFunc: (char, scannedAt) => customResetPeriod(char, scannedAt, 1002, 3),
    },
    {
        taskKey: 'twwEmissaryDelves',
        taskName: '[Dor] Delves',
        minimumLevel: 70,
        icon: iconLibrary.gameDigDug,
        questIds: [
            82746, // Delves: Breaking Tough to Loot Stuff
            82707, // Delves: Earthen Defense
            82710, // Delves: Empire-ical Exploration
            82711, // Delves: Lost and Found
            // 82708, // Delves: Nerubian Menace [NOTE: this one is not resetting]
            82709, // Delves: Percussive Archaeology
            82712, // Delves: Trouble Up and Down Khaz Algar
            82706, // Delves: Worldwide Research
        ],
        questReset: DbResetType.Custom,
        customExpiryFunc: (char, scannedAt) => customResetPeriod(char, scannedAt, 1003, 3),
    },
    {
        taskKey: 'twwEmissaryWorldsoul',
        taskName: '[Dor] Worldsoul',
        minimumLevel: 70,
        icon: aliasedIcons.planet,
        questIds: [
            82511, // Worldsoul: Awakening Machine
            87419, // Worldsoul: Delves
            87417, // Worldsoul: Dungeons
            82453, // Worldsoul: Encore!
            82516, // Worldsoul: Forging a Pact
            82458, // Worldsoul: Renown
            82482, // Worldsoul: Snuffling
            82483, // Worldsoul: Spreading the Light
            87423, // Worldsoul: Undermine Explorer
            87422, // Worldsoul: Undermine World Quests
            82512, // Worldsoul: World Boss
            87424, // Worldsoul: World Bosses
            82452, // Worldsoul: World Quests
            82491, // Worldsoul: Ara-Kara, City of Echoes [N]
            82494, // Worldsoul: Ara-Kara, City of Echoes [H]
            82502, // Worldsoul: Ara-Kara, City of Echoes [M]
            82485, // Worldsoul: Cinderbrew Meadery [N]
            82495, // Worldsoul: Cinderbrew Meadery [H]
            82503, // Worldsoul: Cinderbrew Meadery [M]
            82492, // Worldsoul: City of Threads [N]
            82496, // Worldsoul: City of Threads [H]
            82504, // Worldsoul: City of Threads [M]
            82488, // Worldsoul: Darkflame Cleft [N]
            82498, // Worldsoul: Darkflame Cleft [H]
            82506, // Worldsoul: Darkflame Cleft [M]
            82490, // Worldsoul: Priory of the Sacred Flame [N]
            82499, // Worldsoul: Priory of the Sacred Flame [H]
            82507, // Worldsoul: Priory of the Sacred Flame [M]
            82489, // Worldsoul: The Dawnbreaker [N]
            82493, // Worldsoul: The Dawnbreaker [H]
            82501, // Worldsoul: The Dawnbreaker [M]
            82486, // Worldsoul: The Rookery [N]
            82500, // Worldsoul: The Rookery [H]
            82508, // Worldsoul: The Rookery [M]
            82487, // Worldsoul: The Stonevault [N]
            82497, // Worldsoul: The Stonevault [H]
            82505, // Worldsoul: The Stonevault [M]
            82509, // Worldsoul: Nerub-ar Palace [LFR]
            82659, // Worldsoul: Nerub-ar Palace [N]
            82510, // Worldsoul: Nerub-ar Palace [H]
        ],
        questReset: DbResetType.Custom,
        customExpiryFunc: (char, scannedAt) => customResetPeriod(char, scannedAt, 1001, 3),
    },
    {
        taskKey: 'twwDungeon',
        taskName: '[Dor] Dungeon',
        minimumLevel: 80,
        accountWide: true,
    },
    {
        taskKey: 'twwTheaterTroupe',
        taskName: '[IoD] Theater Troupe',
        minimumLevel: 80,
        icon: iconLibrary.solarMasksBold,
    },
    {
        taskKey: 'twwAwakeningTheMachine',
        taskName: '[RD ] Awakening the Machine',
        minimumLevel: 70,
        noProgress: true,
    },
    {
        taskKey: 'twwRollinDown',
        taskName: "[RD ] Rollin' Down in the Deeps",
        minimumLevel: 80,
    },
    {
        taskKey: 'twwSpreadingTheLight',
        taskName: '[Hal] Spreading the Light',
        minimumLevel: 70,
        noProgress: true,
        icon: iconLibrary.gameCandleLight,
    },
    {
        taskKey: 'twwSpiderPact',
        taskName: '[AK ] Spider Pact',
        minimumLevel: 70,
        accountWide: true,
        icon: iconLibrary.mdiListStatus,
    },
    {
        taskKey: 'twwSpiderWeekly',
        taskName: '[AK ] Spider Weekly',
        minimumLevel: 70,
        icon: iconLibrary.gameSpiderFace,
    },
    {
        taskKey: 'twwSpecialAssignment1',
        taskName: 'Special Assignment 1',
        minimumLevel: 70,
        noProgress: true,
        showQuestName: true,
    },
    {
        taskKey: 'twwSpecialAssignment2',
        taskName: 'Special Assignment 2',
        minimumLevel: 70,
        noProgress: true,
        showQuestName: true,
    },
];

export const twwChores11_1: Chore[] = [
    {
        taskKey: 'twwUndermineWorldBossFirst',
        taskName: '[Um] World Boss 1st Kill',
        accountWide: true,
        questIds: [89401],
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwUndermineCartel',
        taskName: '[Um] Choose Cartel',
        accountWide: true,
        icon: iconLibrary.mdiListStatus,
        questIds: [
            84951, // Bilgewater Cartel Weekly Contract
            84954, // Blackwater Cartel Weekly Contract
            84952, // Steamwheedle Cartel Weekly Contract
            84953, // Venture Co. Weekly Contract
        ],
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwUndermineManyJobs',
        taskName: '[Um] 10x Shipping & Handling Jobs',
        questIds: [85869], // Many Jobs, Handle It!
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwUndermineReduce',
        taskName: '[Um] 3x S.C.R.A.P. Jobs',
        icon: iconLibrary.hisTrash,
        questIds: [85879], // Reduce, Resuse, Resell
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwUndermineSurge',
        taskName: '[Um] Surge Pricing',
        questIds: [86775], // Urge to Surge
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwUndermineSpecial',
        taskName: '[Um] Special Assignment',
        noProgress: true,
        questIds: [
            85487, // Boom! Headshot!
            85488, // Security Detail
        ],
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwSideGig',
        taskName: '[Um] Side Gig',
        showQuestName: true,
        questIds: [],
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwRaidPull',
        taskName: '[Raid] Rune Dispenser',
        icon: iconLibrary.mdiSlotMachineOutline,
        questIds: [89350],
        questReset: DbResetType.Weekly,
    },
];

const chettIds = [
    86915, 86917, 86918, 86919, 86920, 86923, 86924, 87302, 87303, 87304, 87305, 87306, 87307,
];
function couldChett(char: Character, chore: Chore): boolean {
    // did they get the initial list yet?
    if (
        !userQuestStore.characterHas(char.id, 87296) &&
        userState.general.characterById[char.id]?.getItemCount(235053) === 0 &&
        userState.general.characterById[char.id]?.getItemCount(236682) === 0
    ) {
        return false;
    }

    // did they complete this task?
    const questId = chore.questIds[0];
    if (userQuestStore.characterHas(char.id, questId)) {
        return true;
    }

    const progressQuests = get(userQuestStore).characters[char.id]?.progressQuests || {};
    let completed = 0;
    let thisInProgress = false;

    for (const chettId of chettIds) {
        if (userQuestStore.characterHas(char.id, chettId)) {
            completed++;
        } else {
            const progressQuest = progressQuests[`q${chettId}`];
            if (progressQuest?.status === QuestStatus.InProgress && chettId === questId) {
                thisInProgress = true;
            }
        }
    }

    if (completed === 4) {
        return false;
    } else {
        return thisInProgress;
    }
}

export const twwChoresChett: Chore[] = [
    {
        taskKey: 'twwChettList',
        taskName: 'Get List!',
        questIds: [87296],
        questReset: DbResetType.Weekly,
        couldGetFunc: () => get(userStore).maxReputation.get(2653) >= 32500, // Cartels renown 13
    },
    {
        taskKey: 'twwChett86915',
        taskName: 'Side with a Cartel',
        questIds: [86915],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett86919',
        taskName: 'Side Gig',
        questIds: [86919],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett87304',
        taskName: 'Excavation Site 9 delve',
        questIds: [87304],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett87303',
        taskName: 'Sidestreet Sluice delve',
        questIds: [87303],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett87305',
        taskName: '2x Car Race',
        questIds: [87305],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett87302',
        taskName: '3x Rare Mob',
        questIds: [87302],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett86924',
        taskName: '5x Battle Pet',
        questIds: [86924],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett86920',
        taskName: '5x War Mode Kill',
        questIds: [86920],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett86917',
        taskName: '10x Delivery Job',
        questIds: [86917],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett87307',
        taskName: '25x Trash Can/Dumpster',
        questIds: [87307],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett87306',
        taskName: '50x Car Can',
        questIds: [87306],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett86923',
        taskName: '50x Runoff Fishing',
        questIds: [86923],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
    {
        taskKey: 'twwChett86918',
        taskName: '100x Empty Can',
        questIds: [86918],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char, chore) => couldChett(char, chore),
    },
];

export const twwChores11_1_5: Chore[] = [
    {
        taskKey: 'twwNightfall',
        taskName: '[W] Nightfall Scenario',
        minimumLevel: 80,
        questIds: [91173], // seems like the only consistent one
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwRadiant1',
        taskName: '[D] Incursion 1',
        minimumLevel: 80,
        showQuestName: true,
        questIds: [
            87480, // Sureki Incursion: The Eastern Assault
            88945, // Radiant Incursion: Rak-Zakaz
        ],
        questReset: DbResetType.Daily,
    },
    {
        taskKey: 'twwRadiant2',
        taskName: '[D] Incursion 2',
        minimumLevel: 80,
        questIds: [
            87477, // Sureki Incursion: Southern Swarm
            88916, // Radiant Incursion: Sureki's End
        ],
        questReset: DbResetType.Daily,
    },
    {
        taskKey: 'twwRadiant3',
        taskName: '[D] Incursion 3',
        minimumLevel: 80,
        questIds: [
            87475, // Sureki Incursion: Hold the Wall
            88711, // Radiant Incursion: Toxins and Pheromones
        ],
        questReset: DbResetType.Daily,
    },
    {
        taskKey: 'twwWindsSatchel',
        taskName: '[D] Winds Satchel',
        minimumLevel: 10,
        questIds: [86695],
        questReset: DbResetType.Daily,
        couldGetFunc: (char) => char.level < 80,
    },
];

export const twwHorrificVisions: Chore[] = [1, 2, 3, 4, 5].map((n) => ({
    taskKey: `twwHorrific${n}`,
    taskName: `[W] Horrific Visions ${n} mask`,
    minimumLevel: 80,
    questIds: [88907 + n],
    questReset: DbResetType.Weekly,
}));
