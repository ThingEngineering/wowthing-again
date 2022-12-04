import type { Task } from '@/types/tasks'


export const taskList: Task[] = [
    // Misc
    {
        key: 'dmfProfessions',
        name: '[DMF] Professions',
        shortName: 'DMF',
    },

    // Holidays
    {
        key: 'holidayArenaSkirmishes',
        name: '[Holiday] Arena Skirmishes',
        shortName: 'Skirm',
    },
    {
        key: 'holidayBattlegrounds',
        name: '[Holiday] Battlegrounds',
        shortName: 'BGs',
    },
    {
        key: 'holidayDungeons',
        name: '[Holiday] Mythic Dungeons',
        shortName: 'Dung',
    },
    {
        key: 'holidayPetBattles',
        name: '[Holiday] Pet Battles',
        shortName: 'Pets',
    },
    {
        key: 'holidayTimewalking',
        name: '[Holiday] Timewalking',
        shortName: 'TW :exclamation:',
    },
    {
        key: 'holidayWorldQuests',
        name: '[Holiday] World Quests',
        shortName: 'WQs',
    },
    {
        key: 'timewalking',
        name: '[Holiday] Timewalking Item',
        shortName: 'TW :item:',
        minimumLevel: 50,
    },

    // PvP
    {
        key: 'somethingDifferent',
        name: '[PvP] Something Different (Brawl)',
        shortName: 'Brawl',
    },

    // Legion
    {
        key: 'legionWitheredTraining',
        name: '[Legion] Withered Army Training',
        shortName: 'Wither',
        minimumLevel: 45,
        requiredQuestId: 44636, // Building an Army
    },

    // Shadowlands
    {
        key: 'slAnima',
        name: '[SL] Anima',
        shortName: 'Anima',
        minimumLevel: 60,
    },
    {
        key: 'slKorthia',
        name: '[SL] Korthia',
        shortName: 'Korth',
        minimumLevel: 60,
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
    {
        key: 'slZerethMortis',
        name: '[SL] Zereth Mortis',
        shortName: 'ZM',
        minimumLevel: 60,
    },

    // Dragonflight
    {
        key: 'dfAidingAccord',
        name: '[DF] Aiding the Accord',
        shortName: 'AtA',
        minimumLevel: 60,
    },
]

export const taskMap: Record<string, Task> = Object.fromEntries(
    taskList.map((task) => [task.key, task])
)
