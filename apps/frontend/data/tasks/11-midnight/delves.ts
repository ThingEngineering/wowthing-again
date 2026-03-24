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
            subChores: [
                {
                    key: 'get',
                    name: 'Get Bounty',
                    questIds: [86371],
                },
                {
                    key: 'use',
                    name: 'Use Bounty',
                    questIds: [92887],
                },
            ],
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
        // {
        //     key: 'nullaeus',
        //     name: "Nullaeus Invasion",
        //     minimumLevel: 90,
        //     alwaysStarted: true,
        //     questIds: [], // ??
        //     questReset: DbResetType.Weekly,
        // },
    ],
};
