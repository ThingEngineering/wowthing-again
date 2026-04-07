import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const midDelves: Task = {
    key: 'midDelves',
    name: '[Mid] Delves',
    shortName: 'Delve',
    minimumLevel: 80,
    showSeparate: true,
    sumChores: true,
    chores: [
        {
            key: 'arcaneRemnant',
            name: '{item:262586}', // Primeval Arcane Remnant
            icon: iconLibrary.gameUnstableOrb,
            minimumLevel: 80,
            accountWide: true,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [93784],
        },
        {
            key: 'repAmani',
            name: 'Rep: {faction:2696}',
            minimumLevel: 90,
            accountWide: true,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [93819],
        },
        {
            key: 'repHarati',
            name: 'Rep: {faction:2704}',
            minimumLevel: 90,
            accountWide: true,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [93822],
        },
        {
            key: 'repSilvermoon',
            name: 'Rep: {faction:2710}',
            minimumLevel: 90,
            accountWide: true,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [93821],
        },
        {
            key: 'repSingularity',
            name: 'Rep: {faction:2699}',
            minimumLevel: 90,
            accountWide: true,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [93820],
        },
        null,
        {
            key: 'bounty',
            name: '{item:252415}', // Trovehunter's Bounty [Season 1]
            icon: iconLibrary.gameTreasureMap,
            minimumLevel: 90,
            alwaysStarted: true,
            subChoresAnyOrder: true,
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [86371],
        },
        {
            key: 'nullaeus',
            name: 'Nullaeus Invasion',
            minimumLevel: 90,
            alwaysStarted: true,
            questIds: [92887],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'gilded',
            name: 'Gilded Stash',
            icon: iconLibrary.gameCutDiamond,
            minimumLevel: 90,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questResetForced: true,
            showQuestName: true,
            subChores: [
                {
                    key: 'stashes',
                    name: '{currency:3290}',
                    progressFunc: (char) => ({
                        have: char.weekly?.delveGilded || 0,
                        need: 4,
                    }),
                },
            ],
        },
    ],
};
