import { Holiday } from '@/enums/holiday';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventBonus: Task = {
    key: 'eventBonus',
    name: '[Event] Bonus',
    shortName: 'Bonus',
    minimumLevel: 10,
    showSeparate: true,
    chores: [
        {
            key: 'delves',
            name: 'Delves',
            minimumLevel: 90,
            requiredHolidays: [Holiday.BonusDelve],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [93595], // A Call to Delves
        },
        {
            key: 'dungeons',
            name: 'Dungeons',
            minimumLevel: 10,
            requiredHolidays: [Holiday.BonusDungeon],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [83347], // Emissary of War
        },
        {
            key: 'worldQuests',
            name: 'World Quests',
            minimumLevel: 10,
            requiredHolidays: [Holiday.BonusWorldQuest],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [83366], // The World Awaits
        },
        {
            key: 'arenaSkirmish',
            name: '[PvP] Arena Skirmishes',
            minimumLevel: 10,
            requiredHolidays: [Holiday.BonusArenaSkirmish],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [83358], // The Arena Calls
        },
        {
            key: 'battleground',
            name: '[PvP] Battlegrounds',
            minimumLevel: 10,
            requiredHolidays: [Holiday.BonusBattleground],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [93593], // A Call to Battle
        },
        {
            key: 'petBattles',
            name: '[PvP] Pet Battles',
            minimumLevel: 10,
            requiredHolidays: [Holiday.BonusPetBattle],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [83357], // The Very Best
        },
    ],
};
