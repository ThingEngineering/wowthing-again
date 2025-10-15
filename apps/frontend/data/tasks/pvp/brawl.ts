import { Constants } from '@/data/constants';
import { Holiday } from '@/enums/holiday';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

const somethingDifferentQuestIds = [47148];

export const pvpBrawl: Task = {
    key: 'pvpBrawl',
    name: '[PvP] Brawl',
    shortName: 'Brawl',
    minimumLevel: Constants.characterMaxLevel,
    chores: [
        {
            key: 'brawlFirstWin',
            name: 'First Win',
            noAlone: true,
            alwaysStarted: true,
            questIds: [47144],
            questReset: DbResetType.Daily,
        },
        {
            key: 'brawlArathiBlizzard',
            name: 'Arathi Blizzard',
            requiredHolidays: [Holiday.BrawlArathiBlizzard],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlClassicAshran',
            name: 'Classic Ashran',
            requiredHolidays: [Holiday.BrawlClassicAshran],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlCompStomp',
            name: 'Comp Stomp',
            requiredHolidays: [Holiday.BrawlCompStomp],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlCookingImpossible',
            name: 'Cooking Impossible',
            requiredHolidays: [Holiday.BrawlCookingImpossible],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlDeepSix',
            name: 'Deep Six',
            requiredHolidays: [Holiday.BrawlDeepSix],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlDeepwindDunk',
            name: 'Deepwind Dunk',
            requiredHolidays: [Holiday.BrawlDeepwindDunk],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlGravityLapse',
            name: 'Gravity Lapse',
            requiredHolidays: [Holiday.BrawlGravityLapse],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlPackedHouse',
            name: 'Packed House',
            requiredHolidays: [Holiday.BrawlPackedHouse],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlShadoPanShowdown',
            name: 'Shado-Pan Showdown',
            requiredHolidays: [Holiday.BrawlShadoPanShowdown],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlSouthshoreVsTarrenMill',
            name: 'Southshore vs. Tarren Mill',
            requiredHolidays: [Holiday.BrawlSouthshoreVsTarrenMill],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlTempleOfHotmogu',
            name: 'Temple of Hotmogu',
            requiredHolidays: [Holiday.BrawlTempleOfHotmogu],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
        {
            key: 'brawlWarsongScramble',
            name: 'Warsong Scramble',
            requiredHolidays: [Holiday.BrawlWarsongScramble],
            questIds: somethingDifferentQuestIds,
            questReset: DbResetType.Weekly,
        },
    ],
};
