import { Holiday } from '@/enums/holiday';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventHallowsEnd: Task = {
    key: 'eventHallowsEnd',
    name: "[Event] Hallow's End",
    shortName: '🎃',
    minimumLevel: 10,
    requiredHolidays: [Holiday.HallowsEnd],
    chores: [
        {
            key: 'headlessHorseman',
            name: 'Headless Horseman',
            icon: iconLibrary.gameCloakedFigureOnHorseback,
            alwaysStarted: true,
            questResetForced: true,
            questReset: DbResetType.Daily,
            progressFunc: (char) => {
                const lockout = char.lockouts?.['200285-1'];
                return { have: lockout?.locked ? 1 : 0, need: 1 };
            },
        },
        // Neighborhoods
        {
            key: 'neighborhoodBroomstick',
            name: 'Broomstick Express',
            icon: iconLibrary.gameMagicBroom,
            questResetForced: true,
            questReset: DbResetType.Daily,
            questIds: [
                92104, // Broomstick Express
            ],
        },
        {
            key: 'neighborhoodSpecter',
            name: 'Specter Inspector',
            icon: iconLibrary.mdiGhost,
            questResetForced: true,
            questReset: DbResetType.Daily,
            questIds: [
                92455, // Specter Inspector
            ],
        },
        {
            key: 'neighborhoodSugar',
            name: 'Sugar Rush',
            icon: iconLibrary.gameCupcake,
            questResetForced: true,
            questReset: DbResetType.Daily,
            questIds: [
                92535, // Witchbane Truffles
                92536, // Bewitched Berry Bites
                92537, // Hexed Honeycombs
                93401, // Howling Honey Drops
                95822, // Twisted Vine Licorice
                95825, // Blighted Core Caramels
                95827, // Blighted Bloom Bites
                95828, // Felroot Crunch
                95829, // Rotleaf Wafers
                97219, // Candy Crafting
                98421, // Candy Crafting
                98422, // Candy Crafting
            ],
        },
    ],
};
