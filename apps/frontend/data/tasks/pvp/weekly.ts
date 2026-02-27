import { Constants } from '@/data/constants';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

// no holiday
// 01/20 => battle + solo
export const pvpWeekly: Task = {
    key: 'pvpWeekly',
    name: '[PvP] Weekly',
    shortName: 'PvP',
    minimumLevel: Constants.characterMaxLevel,
    showSeparate: true,
    chores: [
        {
            key: 'pvpSkirmishes',
            name: '[PvP] Arena Skirmishes',
            questIds: [80187],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'pvpWar',
            name: '[PvP] Epic Battlegrounds',
            questIds: [80186],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'pvpBattle',
            name: '[PvP] Random Battlegrounds',
            questIds: [80184],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'pvpArenas',
            name: '[PvP] Rated Arenas',
            questIds: [80188],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'pvpTeamwork',
            name: '[PvP] Rated Battlegrounds',
            questIds: [80189],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'pvpSolo',
            name: '[PvP] Solo Shuffle',
            questIds: [80185],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'pvpSparks',
            name: '[PvP] Sparks of War',
            questIds: [
                93423, // Sparks of War: Eversong
                93424, // Sparks of War: Zul'Aman
                93425, // Sparks of War: Harandar
                93426, // Sparks of War: Voidstorm
            ],
        },
    ],
};
