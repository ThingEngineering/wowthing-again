import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const battlePetTasks: Task[] = [
    {
        key: 'battlePets',
        name: '[Pets] Battle',
        shortName: 'Pets',
        showSeparate: true,
        chores: [
            {
                key: 'celestialTournament',
                name: 'Celestial Tournament',
                icon: '{image:achievement/8410}',
                accountWide: true,
                questReset: DbResetType.Weekly,
                questIds: [33137],
            },
            {
                key: 'blackrockDepths',
                name: 'Blackrock Depths',
                icon: '{image:achievement/14020}',
                accountWide: true,
                questReset: DbResetType.Weekly,
                questIds: [58458],
            },
            {
                key: 'deadmines',
                name: 'Deadmines',
                icon: '{image:achievement/11856}',
                accountWide: true,
                questReset: DbResetType.Weekly,
                questIds: [46292],
            },
            {
                key: 'gnomeregan',
                name: 'Gnomeregan',
                icon: '{image:achievement/13269}',
                accountWide: true,
                questReset: DbResetType.Weekly,
                questIds: [54186],
            },
            {
                key: 'stratholme',
                name: 'Stratholme',
                icon: '{image:achievement/13627}',
                accountWide: true,
                questReset: DbResetType.Weekly,
                questIds: [56492],
            },
            {
                key: 'wailingCaverns',
                name: 'Wailing Caverns',
                icon: '{image:achievement/11765}',
                accountWide: true,
                questReset: DbResetType.Weekly,
                questIds: [45539],
            },
        ],
    },
];
