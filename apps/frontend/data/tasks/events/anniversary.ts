import { Holiday } from '@/enums/holiday';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventAnniversary: Task = {
    key: 'eventAnniversary',
    name: '[Event] Anniversary',
    requiredHolidays: [Holiday.Anniversary],
    shortName: 'Anni',
    minimumLevel: 10,
    showSeparate: true,
    chores: [
        {
            key: 'celebrate',
            name: 'Celebrate',
            icon: iconLibrary.gameGlassCelebration,
            minimumLevel: 10,
            questReset: DbResetType.Daily,
            questIds: [84616],
            progressFunc: (char) => {
                if (char.auras?.[455050]?.duration > 0) {
                    return { have: 1, need: 1 };
                }
            },
        },
        {
            key: 'trivia',
            name: 'Trivia',
            minimumLevel: 10,
            icon: iconLibrary.mdiChatQuestionOutline,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [
                43323, // A
                43461, // H
            ],
        },
        {
            key: 'azuregos',
            name: '[OG] Azuregos',
            icon: iconLibrary.gameWyvern,
            minimumLevel: 30,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [47462],
        },
        {
            key: 'dragonsOfNightmare',
            name: '[OG] Dragons of Nightmare',
            icon: iconLibrary.gameSpikedDragonHead,
            minimumLevel: 30,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [47463],
        },
        {
            key: 'lordKazzak',
            name: '[OG] Lord Kazzak',
            icon: iconLibrary.gameEvilMinion,
            minimumLevel: 30,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [47461],
        },
        {
            key: 'archavon',
            name: '[GC] Archavon',
            icon: iconLibrary.gameRockGolem,
            minimumLevel: 30,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [84256],
        },
        {
            key: 'doomwalker',
            name: '[GC] Doomwalker',
            icon: iconLibrary.gameVintageRobot,
            minimumLevel: 30,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [60214],
        },
        {
            key: 'sha',
            name: '[GC] Sha of Anger',
            icon: iconLibrary.gameIfrit,
            minimumLevel: 30,
            questReset: DbResetType.Daily,
            questResetForced: true,
            questIds: [84282],
        },
        {
            key: 'worldBosses',
            name: 'World Bosses',
            icon: iconLibrary.gameDarkSquad,
            minimumLevel: 30,
            questReset: DbResetType.Weekly,
            questIds: [
                47254, // The Originals
                60215, // Timely Gate Crashers
            ],
        },
        {
            key: 'alteracValley',
            name: 'Alterac Valley',
            icon: iconLibrary.gamePeaks,
            minimumLevel: 10,
            questReset: DbResetType.Weekly,
            questIds: [57300],
        },
        {
            key: 'codex',
            name: "Chromie's Codex",
            icon: iconLibrary.gameDuration,
            minimumLevel: 10,
            questReset: DbResetType.Weekly,
            questIds: [82783],
        },
    ],
};
