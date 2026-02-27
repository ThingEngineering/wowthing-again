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
            key: 'twwEmissaryArchives',
            name: '[Dor] Archives',
            minimumLevel: 80,
            icon: aliasedIcons.bookshelf,
            questIds: [],
            questReset: DbResetType.Custom,
        },
        {
            key: 'midDelves',
            name: '[Dor] Delves',
            minimumLevel: 80,
            icon: iconLibrary.gameDigDug,
            questReset: DbResetType.Weekly,
            questIds: [
                93909, // Delves: Worldwide Research
            ],
        },
        {
            key: 'midUnity',
            name: '[???] Unity',
            minimumLevel: 80,
            icon: aliasedIcons.planet,
            questIds: [
                // ???
            ],
        },
        {
            key: 'midDungeon',
            name: '[???] Dungeon',
            minimumLevel: Constants.characterMaxLevel,
            accountWide: true,
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
            questReset: DbResetType.Weekly,
        },
        // 94446, A Nightmarish Task, weekly?
    ],
};
