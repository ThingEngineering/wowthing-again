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
            key: 'friend',
            name: 'Friend',
            icon: iconLibrary.gameGoblinHead,
            alwaysStarted: true,
            subChores: [
                {
                    key: 'choose',
                    name: 'Choose Friend',
                    questReset: DbResetType.Daily,
                    questResetForced: true,
                    questIds: [
                        57040, // Hunter Akana / Vim Brineheart
                        57041, // Farseer Ori / Neri Sharpfin
                        57042, // Bladesman Inowari / Poen Gillbrack
                    ],
                },
                {
                    key: 'quests',
                    name: 'Daily Quests',
                    questReset: DbResetType.Daily,
                    questResetForced: true,
                    questCount: 3,
                    questIds: [
                        54949, 55032, 55625, 55633, 55636, 55637, 55638, 55659, 55661, 55662, 55663,
                        55664, 55665, 55681, 55683, 55701, 55714, 55715, 55728, 55750, 55751, 55766,
                        55767, 55768, 55770, 55771, 55772, 55773, 55774, 55775, 55776, 55777, 55845,
                        55846, 55871, 55872, 55873, 55874, 55875, 55876, 55877, 55878, 55883, 55980,
                        55984, 55985, 55986, 55993, 56000, 56001, 56002, 56035, 56075, 56146, 56149,
                        56150, 56151, 56152, 56153, 56154, 56155, 56157, 56158, 56159, 56160, 56222,
                        56223, 56224, 56225, 56226, 56227, 56231, 56232, 56233, 56264, 56265, 56266,
                        56370,
                    ],
                },
            ],
        },
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
            key: 'worldBoss',
            name: 'World Boss',
            icon: iconLibrary.gameSpikedDragonHead,
            questReset: DbResetType.Weekly,
            questIds: [
                56056, // Wekemara
                56057, // Ulmath, the Soulbinder
            ],
        },
    ],
};
