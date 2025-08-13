import { get } from 'svelte/store';
import type { DateTime } from 'luxon';

import { Constants } from '../constants';
import { customResetPeriod } from './custom-reset-period';
import { QuestStatus } from '@/enums/quest-status';
import { aliasedIcons, iconLibrary } from '@/shared/icons';
import { timeState } from '@/shared/state/time.svelte';
import { DbResetType } from '@/shared/stores/db/enums';
import { userQuestStore, userStore } from '@/stores';
import { userState } from '@/user-home/state/user';
import type { Character } from '@/types';
import type { Chore } from '@/types/tasks';

const threeWeekDecorator = (expires: DateTime) => {
    const daysRemaining = expires.diff(timeState.time).toMillis() / 1000 / 86400;
    if (daysRemaining < 7) {
        return 'decorator-warn';
    } else if (daysRemaining < 14) {
        return 'decorator-shrug';
    } else {
        return 'decorator-success';
    }
};

export const twwChores11_0: Chore[] = [
    {
        taskKey: 'twwEmissaryArchives',
        taskName: '[Dor] Archives',
        minimumLevel: 70,
        icon: aliasedIcons.bookshelf,
        questIdFunc: (char) =>
            userQuestStore.characterHas(char.id, 83450)
                ? [82679] // Archives: Seeking History
                : [82678], // Archives: The First Disc
        questReset: DbResetType.Custom,
        customExpiryFunc: (char, scannedAt) => customResetPeriod(char, scannedAt, 1002, 3),
        decorationFunc: threeWeekDecorator,
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
        decorationFunc: threeWeekDecorator,
    },
    {
        taskKey: 'twwEmissaryWorldsoul',
        taskName: '[Dor] Worldsoul',
        minimumLevel: 70,
        icon: aliasedIcons.planet,
        questIds: [
            82511, // Awakening Machine
            89492, // Dastardly Duos in the Dome!
            87419, // Delves
            87417, // Dungeons
            82453, // Encore!
            82516, // Forging a Pact
            89514, // Horrific Visions Revisited
            91855, // K'aresh World Quests
            89502, // Nightfall
            91052, // Overcharged Delves
            82458, // Renown
            82482, // Snuffling
            82483, // Spreading the Light
            87423, // Undermine Explorer
            87422, // Undermine World Quests
            82512, // World Boss
            87424, // World Bosses
            82452, // World Quests
            82491, // Ara-Kara, City of Echoes [N]
            82494, // Ara-Kara, City of Echoes [H]
            82502, // Ara-Kara, City of Echoes [M]
            82485, // Cinderbrew Meadery [N]
            82495, // Cinderbrew Meadery [H]
            82503, // Cinderbrew Meadery [M]
            82492, // City of Threads [N]
            82496, // City of Threads [H]
            82504, // City of Threads [M]
            82488, // Darkflame Cleft [N]
            82498, // Darkflame Cleft [H]
            82506, // Darkflame Cleft [M]
            82490, // Priory of the Sacred Flame [N]
            82499, // Priory of the Sacred Flame [H]
            82507, // Priory of the Sacred Flame [M]
            82489, // The Dawnbreaker [N]
            82493, // The Dawnbreaker [H]
            82501, // The Dawnbreaker [M]
            82486, // The Rookery [N]
            82500, // The Rookery [H]
            82508, // The Rookery [M]
            82487, // The Stonevault [N]
            82497, // The Stonevault [H]
            82505, // The Stonevault [M]
            82509, // Nerub-ar Palace [LFR]
            82659, // Nerub-ar Palace [N]
            82510, // Nerub-ar Palace [H]
        ],
        questReset: DbResetType.Custom,
        customExpiryFunc: (char, scannedAt) => customResetPeriod(char, scannedAt, 1001, 3),
        decorationFunc: threeWeekDecorator,
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
        icon: iconLibrary.gameNightSky,
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

export const twwHorrificVisions: Chore[] = (<[number, string][]>[
    [88905, 'Kill boss'],
    [88908, '0 mask clear'],
    [88909, '1 mask clear'],
    [88910, '2 mask clear'],
    [88911, '3 mask clear'],
    [88912, '4 mask clear'],
]).map(([questId, name]) => ({
    taskKey: `twwHorrific${questId}`,
    taskName: `[W] ${name}`,
    minimumLevel: 80,
    questIds: [questId],
    questReset: DbResetType.Weekly,
}));

export const twwChores11_2_0: Chore[] = [
    {
        taskKey: 'twwMoreThanPhase',
        taskName: '[W][A] More Than Just a Phase',
        accountWide: true,
        questIds: [91093],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
    },
    {
        taskKey: 'twwWarrant',
        taskName: '[W][A] Warrant',
        accountWide: true,
        questIds: [
            90122, // Eliminate Xy'vox the Twisted
            90123, // Eliminate Hollowbane
            90124, // Eliminate Shatterpulse
            90125, // Eliminate Purple Peat
            90126, // Eliminate Grubber
            90127, // Eliminate Arcana-Monger So'zer
        ],
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwReshanor',
        taskName: '[W][A] World Boss',
        accountWide: true,
        questIds: [87352],
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwKareshSpecialUnlock',
        taskName: '[W] Special Unlock',
        icon: iconLibrary.mdiLockOutline,
        questIds: [
            91193, // Overshadowed
            91203, // Aligned Views
        ],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
    },

    {
        taskKey: 'twwKareshSpecial',
        taskName: '[W] Special Assignment',
        icon: iconLibrary.gameScrollQuill,
        noProgress: true,
        showQuestName: true,
        questIds: [
            89293, // Overshadowed
            89294, // Aligned Views
        ],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
    },
    {
        taskKey: 'twwEcologicalSuccession',
        taskName: '[W] Ecological Succession',
        questIds: [85460],
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) =>
            userState.quests.characterById.get(char.id)?.hasQuestById?.has?.(85037), // Shadows En Garde (chapter 4)
    },
    {
        taskKey: 'twwMakingDeposit1',
        taskName: '[W] Anima: Atrium',
        // maybe these need to be subChores?
        questIds: [89062], // Devourer Attack: The Atrium
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
    },
    {
        taskKey: 'twwMakingDeposit2',
        taskName: '[W] Anima: Eco-dome',
        questIds: [89061], // Devourer Attack: Eco-dome: Primus
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
    },
    {
        taskKey: 'twwMakingDeposit3',
        taskName: '[W] Anima: Oasis',
        questIds: [85722], // Devourer Attack: The Oasis
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
    },
    {
        taskKey: 'twwMakingDeposit4',
        taskName: '[W] Anima: Tazavesh',
        questIds: [89063], // Devourer Attack: Tazavesh
        questReset: DbResetType.Weekly,
        couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
    },
];

export const twwPinnacle: Chore[] = [
    {
        taskKey: 'twwPinnacle1',
        taskName: '[W] Veteran Cache 1',
        noProgress: true,
        questIds: [91179],
        questReset: DbResetType.Weekly,
    },
    {
        taskKey: 'twwPinnacle2',
        taskName: '[W] Veteran Cache 2',
        noProgress: true,
        questIds: [91180],
        questReset: DbResetType.Weekly,
    },
];
