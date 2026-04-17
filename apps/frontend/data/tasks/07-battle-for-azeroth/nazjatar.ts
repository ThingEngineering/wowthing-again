import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const bfaNazjatar: Task = {
    key: 'bfaNazjatar',
    name: '[BfA] Nazjatar',
    shortName: 'Naz',
    showSeparate: true,
    chores: [
        {
            key: 'ancientBark',
            name: '{item:170184}',
            icon: iconLibrary.gameTreeFace,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [57140],
        },
        {
            key: 'mardivas',
            name: 'Laboritory of Mardivas',
            icon: iconLibrary.gameFizzingFlask,
            questReset: DbResetType.Weekly,
            questIds: [55121],
        },
        {
            key: 'chooseFriend',
            name: 'Choose Friend',
            icon: iconLibrary.gameGoblinHead,
            questReset: DbResetType.Daily,
            questIds: [
                57040, // Hunter Akana / Vim Brineheart
                57041, // Farseer Ori / Neri Sharpfin
                57042, // Bladesman Inowari / Poen Gillbrack
            ],
        },
    ],
};
