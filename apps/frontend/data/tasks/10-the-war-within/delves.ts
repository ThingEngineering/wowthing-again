import { iconComponents } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const twwDelves: Task = {
    key: 'twwDelves',
    name: '[TWW] Delves',
    shortName: 'Delve',
    minimumLevel: 80,
    showSeparate: true,
    chores: [
        {
            key: 'keys',
            name: 'Keys',
            minimumLevel: 80,
            questReset: DbResetType.Weekly,
            subChores: [91175, 91176, 91177, 91178].map((questId, index) => ({
                key: `key${index}`,
                name: '{currency:3028}', // Restored Coffer Key
                noProgress: true,
                questIds: [questId],
                questReset: DbResetType.Weekly,
            })),
        },
        {
            key: 'gilded',
            name: 'Gilded Stash',
            minimumLevel: 80,
            icon: iconComponents.EmojioneGemStone,
            questReset: DbResetType.Weekly,
            subChores: [1, 2, 3].map((index) => ({
                key: `stash${index}`,
                name: '{currency:3290}', // Gilded Ethereal Crest
                noProgress: true,
                questReset: DbResetType.Weekly,
                progressFunc: (char) => {
                    const have = char.weekly?.delveGilded || 0;
                    return { have: have >= index ? 1 : 0, need: 1 };
                },
            })),
        },
        {
            key: 'map',
            name: 'Map Drop',
            minimumLevel: 80,
            noProgress: true,
            icon: iconComponents.EmojioneWorldMap,
            questReset: DbResetType.Weekly,
            questIds: [86371],
        },
        null,
        {
            key: 'archaicCipher',
            name: 'Archaic Cipher',
            minimumLevel: 70,
            accountWide: true,
            noProgress: true,
            questReset: DbResetType.Weekly,
            questIds: [84370],
        },
        {
            key: 'repCouncil',
            name: 'Rep: Council of Dornogal',
            minimumLevel: 80,
            accountWide: true,
            noProgress: true,
            questReset: DbResetType.Weekly,
            questIds: [83317],
        },
        {
            key: 'repAssembly',
            name: 'Rep: Assembly of the Deeps',
            minimumLevel: 80,
            accountWide: true,
            noProgress: true,
            questReset: DbResetType.Weekly,
            questIds: [83318],
        },
        {
            key: 'repSevered',
            name: 'Rep: Severed Threads',
            minimumLevel: 80,
            accountWide: true,
            noProgress: true,
            questReset: DbResetType.Weekly,
            questIds: [83319],
        },
        {
            key: 'repHallowfall',
            name: 'Rep: Hallowfall Arathi',
            minimumLevel: 80,
            accountWide: true,
            noProgress: true,
            questReset: DbResetType.Weekly,
            questIds: [83320],
        },
        {
            key: 'repCartels',
            name: 'Rep: Cartels of Undermine',
            minimumLevel: 80,
            accountWide: true,
            noProgress: true,
            questReset: DbResetType.Weekly,
            questIds: [87407],
        },
        {
            key: 'repKaresh',
            name: "Rep: The K'aresh Trust",
            minimumLevel: 80,
            accountWide: true,
            noProgress: true,
            questReset: DbResetType.Weekly,
            questIds: [91453],
        },

        // {
        //     key: 'twwDelveKyveza',
        //     name: "Ky'veza Invasion",
        //     minimumLevel: 80,
        //     noProgress: true,
        //     questIds: [], // ??
        //     questReset: DbResetType.Weekly,
        // },
    ],
};
