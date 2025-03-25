import { get } from 'svelte/store';

import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import { userStore } from '@/stores';
import type { Chore } from '@/types/tasks';

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
        taskKey: 'twwUndermineChett',
        taskName: '[Um] C.H.E.T.T. List',
        questIds: [87296],
        questReset: DbResetType.Weekly,
        couldGetFunc: () => get(userStore).maxReputation.get(2653) >= 32500, // Cartels renown 13
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
];
