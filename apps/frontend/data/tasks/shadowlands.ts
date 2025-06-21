import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const shadowlandsTasks: Task[] = [
    // Shadowlands
    {
        key: 'slAnima',
        name: '[SL] Anima',
        shortName: 'Anima',
        minimumLevel: 60,
        questIds: [
            61981, // Venthyr
            61982, // Kyrian
            61983, // Necrolord
            61984, // Night Fae
        ],
        questReset: DbResetType.Weekly,
    },
    {
        key: 'slShapingFate',
        name: '[SL] Shaping Fate (Korthia)',
        shortName: 'Korth',
        minimumLevel: 60,
        questIds: [63949],
        questReset: DbResetType.Weekly,
    },
    {
        key: 'slPatterns',
        name: '[SL] Patterns (Zereth Mortis)',
        shortName: 'ZM',
        minimumLevel: 60,
        questIds: [66042],
        questReset: DbResetType.Weekly,
    },
    {
        key: 'slMawAssault',
        name: '[SL] Maw Assault',
        shortName: 'Maw ⚔',
        minimumLevel: 60,
    },
    {
        key: 'slTormentors',
        name: '[SL] Tormentors of Torghast',
        shortName: 'Torm',
        minimumLevel: 60,
    },
];
