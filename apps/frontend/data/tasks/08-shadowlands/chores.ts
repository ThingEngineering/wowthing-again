import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const slChores: Task = {
    key: 'slMisc',
    name: '[SL] Chores',
    shortName: 'SL',
    minimumLevel: 60,
    showSeparate: true,
    chores: [
        {
            key: 'anima',
            name: 'Anima',
            questIds: [
                61981, // Venthyr
                61982, // Kyrian
                61983, // Necrolord
                61984, // Night Fae
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'lostSouls',
            name: 'Return Lost Souls',
            questIds: [
                62860, // Night Fae
                62863, // Kyrian
                62866, // Necrolord
                62869, // Venthyr
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'worldBoss',
            name: 'World Boss',
            questIds: [
                61813, // Valinor, the Light of Eons
                61814, // Nurgash Muckformed
                61815, // Oranomonos the Everbranching
                61816, // Mortanis
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'mawVenari',
            name: "[Maw] Ve'nari Rep",
            questIds: [64541],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'mawWorldBoss',
            name: '[Maw] World Boss',
            questIds: [64547],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'korthiaLost',
            name: '[Kor] Lost Research',
            questIds: [65266],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'korthiaShaping',
            name: '[Kor] Shaping Fate',
            questIds: [63949],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'zerethPatterns',
            name: '[ZM ] Patterns Within Patterns',
            questIds: [66042],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'zerethWorldBoss',
            name: '[ZM ] World Boss',
            questIds: [65695],
            questReset: DbResetType.Weekly,
        },
    ],
};
