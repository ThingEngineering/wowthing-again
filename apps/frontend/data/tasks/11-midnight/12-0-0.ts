import { Constants } from '@/data/constants';
import { aliasedIcons, iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const midChores12_0_0: Task = {
    key: 'midChores12_0',
    name: '[Mid] 12.0.x',
    shortName: '12.0',
    showSeparate: true,
    chores: [
        {
            key: 'midUnity',
            name: 'Unity',
            minimumLevel: 90,
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
        {
            key: 'midHope',
            name: 'Hope in the Darkest Corners',
            minimumLevel: 80,
            icon: iconLibrary.gameCandleLight,
            questReset: DbResetType.Weekly,
            questIds: [95468],
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
            key: 'midDungeon',
            name: 'Dungeon',
            minimumLevel: Constants.characterMaxLevel,
            accountWide: true,
            showQuestName: true,
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
        // 94446, A Nightmarish Task, weekly?
    ],
};
