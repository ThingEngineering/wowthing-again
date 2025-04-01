import { get } from 'svelte/store';

import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import { userQuestStore, userStore } from '@/stores';
import type { Chore } from '@/types/tasks';
import type { Character } from '@/types';
import { QuestStatus } from '@/enums/quest-status';

export const twwChores11_0: Chore[] = [
    {
        taskKey: 'twwEmissaryArchives',
        taskName: '[Dor] Archives',
        minimumLevel: 70,
    },
    {
        taskKey: 'twwEmissaryDelves',
        taskName: '[Dor] Delves',
        minimumLevel: 70,
    },
    {
        taskKey: 'twwEmissaryWorldsoul',
        taskName: '[Dor] Worldsoul',
        minimumLevel: 70,
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
        questIds: [84948],
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
        taskKey: 'twwRaidPull',
        taskName: '[Raid] Rune Dispenser',
        noProgress: true,
        questIds: [89350],
    },
];

const chettIds = [
    86915, 86917, 86918, 86919, 86920, 86923, 86924, 87302, 87303, 87304, 87305, 87306, 87307,
];
function couldChett(char: Character, chore: Chore): boolean {
    // did they get the initial list yet?
    if (!userQuestStore.characterHas(char.id, 87296)) {
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
