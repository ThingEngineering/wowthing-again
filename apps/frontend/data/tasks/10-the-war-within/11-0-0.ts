import type { DateTime } from 'luxon';

import { userQuestStore } from '@/stores';
import { aliasedIcons, iconLibrary } from '@/shared/icons';
import { timeState } from '@/shared/state/time.svelte';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

import { customResetPeriod } from '../custom-reset-period';

const threeWeekDecorator = (expires: DateTime) => {
    const daysRemaining = expires.diff(timeState.slowTime).toMillis() / 1000 / 86400;
    if (daysRemaining < 7) {
        return 'decorator-warn';
    } else if (daysRemaining < 14) {
        return 'decorator-shrug';
    } else {
        return 'decorator-success';
    }
};

export const twwChores11_0_0: Task = {
    key: 'twwChores11_0',
    name: '[TWW] 11.0.x',
    shortName: '11.0',
    showSeparate: true,
    chores: [
        {
            key: 'twwEmissaryArchives',
            name: '[Dor] Archives',
            minimumLevel: 70,
            icon: aliasedIcons.bookshelf,
            questIds: (char) =>
                userQuestStore.characterHas(char.id, 83450)
                    ? [82679] // Archives: Seeking History
                    : [82678], // Archives: The First Disc
            questReset: DbResetType.Custom,
            customExpiryFunc: (char, scannedAt) => customResetPeriod(char, scannedAt, 1002, 3),
            decorationFunc: threeWeekDecorator,
        },
        {
            key: 'twwEmissaryDelves',
            name: '[Dor] Delves',
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
            key: 'twwEmissaryWorldsoul',
            name: '[Dor] Worldsoul',
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
            key: 'twwDungeon',
            name: '[Dor] Dungeon',
            minimumLevel: 80,
            accountWide: true,
            questIds: [
                83465, // Ara-Kara, City of Echoes
                83436, // Cinderbrew Meadery
                83469, // City of Threads
                83443, // Darkflame Cleft
                83458, // Priory of the Sacred Flame
                83459, // The Dawnbreaker
                83432, // The Rookery
                83457, // The Stonevault
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwTheaterTroupe',
            name: '[IoD] Theater Troupe',
            minimumLevel: 80,
            icon: iconLibrary.solarMasksBold,
            questIds: [83240],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwAwakeningTheMachine',
            name: '[RD ] Awakening the Machine',
            minimumLevel: 70,
            noProgress: true,
            questIds: [83333],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwRollinDown',
            name: "[RD ] Rollin' Down in the Deeps",
            minimumLevel: 80,
            questIds: [82946],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwSpreadingTheLight',
            name: '[Hal] Spreading the Light',
            minimumLevel: 70,
            noProgress: true,
            icon: iconLibrary.gameCandleLight,
            questIds: [76586],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwSpiderPact',
            name: '[AK ] Spider Pact',
            minimumLevel: 70,
            accountWide: true,
            icon: iconLibrary.mdiListStatus,
            questIds: [
                80544, // The Weaver
                80545, // The General
                80546, // The Vizier
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwSpiderWeekly',
            name: '[AK ] Spider Weekly',
            minimumLevel: 70,
            icon: iconLibrary.gameSpiderFace,
            questIds: [
                80670, // Eyes of the Weaver
                80671, // Blade of the General
                80672, // Hand of the Vizier
            ],
            questReset: DbResetType.Weekly,
        },
        // {
        //     key: 'twwSpecialAssignment1',
        //     name: 'Special Assignment 1',
        //     minimumLevel: 70,
        //     noProgress: true,
        //     showQuestName: true,
        //     questReset: DbResetType.BiWeekly,
        // },
        // {
        //     key: 'twwSpecialAssignment2',
        //     name: 'Special Assignment 2',
        //     minimumLevel: 70,
        //     noProgress: true,
        //     showQuestName: true,
        //     questReset: DbResetType.BiWeekly,
        // },
    ],
};
