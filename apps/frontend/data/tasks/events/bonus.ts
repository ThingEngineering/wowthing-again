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
            minimumLevel: 90,
            requiredHolidays: [Holiday.BonusDungeon],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [93598], // Emissary of War
        },
        {
            key: 'worldQuests',
            name: 'World Quests',
            minimumLevel: 90,
            requiredHolidays: [Holiday.BonusWorldQuest],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [93605], // The World Awaits
        },
        {
            key: 'arenaSkirmish',
            name: '[PvP] Arena Skirmishes',
            minimumLevel: 90,
            requiredHolidays: [Holiday.BonusArenaSkirmish],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [93600], // The Arena Calls
        },
        {
            key: 'battleground',
            name: '[PvP] Battlegrounds',
            minimumLevel: 90,
            requiredHolidays: [Holiday.BonusBattleground],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [93593], // A Call to Battle
        },
        {
            key: 'petBattles',
            name: '[PvP] Pet Battles',
            minimumLevel: 90,
            requiredHolidays: [Holiday.BonusPetBattle],
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [93599], // The Very Best
        },
    ],
};
