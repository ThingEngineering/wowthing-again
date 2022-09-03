import type { Task } from '@/types/tasks'


export const taskList: Task[] = [
    {
        key: 'somethingDifferent',
        name: 'PvP - Something Different (Brawl)',
        shortName: 'Brawl',
    },

    {
        key: 'dmfProfessions',
        name: 'Darkmoon Faire - Professions',
        shortName: 'DMF',
    },

    // Holidays
    {
        key: 'holidayArenaSkirmishes',
        name: 'Holiday - Arena Skirmishes',
        shortName: 'Skirm',
    },
    {
        key: 'holidayBattlegrounds',
        name: 'Holiday - Battlegrounds',
        shortName: 'BGs',
    },
    {
        key: 'holidayDungeons',
        name: 'Holiday - Mythic Dungeons',
        shortName: 'Dung',
    },
    {
        key: 'holidayPetBattles',
        name: 'Holiday - Pet Battles',
        shortName: 'Pets',
    },
    {
        key: 'holidayTimewalking',
        name: 'Holiday - Timewalking',
        shortName: 'TW :exclamation:',
    },
    {
        key: 'holidayWorldQuests',
        name: 'Holiday - World Quests',
        shortName: 'WQs',
    },
    {
        key: 'timewalking',
        name: 'Holiday - Timewalking Item',
        shortName: 'TW :item:',
        minimumLevel: 50,
    },

    // Legion
    {
        key: 'legionWitheredTraining',
        name: 'Legion - Withered Army Training',
        shortName: 'Wither',
        minimumLevel: 45,
        requiredQuestId: 44636, // Building an Army
    },

    // Shadowlands
    {
        key: 'slAnima',
        name: 'Shadowlands - Anima',
        shortName: 'Anima',
    },
    {
        key: 'slKorthia',
        name: 'Shadowlands - Korthia',
        shortName: 'Korth',
    },
    {
        key: 'slMawAssault',
        name: 'Shadowlands - Maw Assault',
        shortName: 'Maw ⚔',
    },
    {
        key: 'slNewDeal',
        name: 'Shadowlands - A New Deal (PvP)',
        shortName: 'Deal',
    },
    {
        key: 'slTormentors',
        name: 'Shadowlands - Tormentors of Torghast',
        shortName: 'Torm',
    },
    {
        key: 'slZerethMortis',
        name: 'Shadowlands - Zereth Mortis',
        shortName: 'ZM',
    },
    {
        key: 'slFatedWorldQuest',
        name: 'Shadowlands - Fated Raid WQ',
        shortName: 'FWQ',
    },
]

export const taskMap: Record<string, Task> = Object.fromEntries(
    taskList.map((task) => [task.key, task])
)
