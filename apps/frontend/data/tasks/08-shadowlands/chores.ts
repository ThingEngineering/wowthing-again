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
            key: 'dungeons',
            name: 'Dungeons',
            alwaysStarted: true,
            subChoresAnyOrder: true,
            subChores: [
                {
                    key: 'aValuableFind',
                    name: 'A Valuable Find',
                    showQuestName: true,
                    questIds: [
                        60250, // A Valuable Find: Theater of Pain
                        60251, // A Valuable Find: Plaguefall
                        60252, // A Valuable Find: Spires of Ascension
                        60253, // A Valuable Find: Necrotic Wake
                        60254, // A Valuable Find: Tirna Scithe
                        60255, // A Valuable Find: The Other Side
                        60256, // A Valuable Find: Halls of Atonement
                        60257, // A Valuable Find: Sanguine Depths
                    ],
                },
                {
                    key: 'tradingFavors',
                    name: 'Trading Favors',
                    showQuestName: true,
                    questIds: [
                        60242, // Trading Favors: Necrotic Wake
                        60243, // Trading Favors: Sanguine Depths
                        60244, // Trading Favors: Halls of Atonement
                        60245, // Trading Favors: The Other Side
                        60246, // Trading Favors: Tirna Scithe
                        60247, // Trading Favors: Theater of Pain
                        60248, // Trading Favors: Plaguefall
                        60249, // Trading Favors: Spires of Ascension
                    ],
                },
            ],
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
