import { Holiday } from '@/enums/holiday';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

export const holidayMinimumLevel: Record<number, number> = {
    // Timewalking: TBC
    559: 30,
    622: 30,
    623: 30,
    624: 30,
    // Timewalking: WotLK
    562: 30,
    616: 30,
    617: 30,
    618: 30,
    // Timewalking: Cata
    587: 35,
    628: 35,
    629: 35,
    630: 35,
    // Timewalking: MoP
    643: 35,
    652: 35,
    654: 35,
    656: 35,
    // Timewalking: WoD
    1056: 40,
    1063: 40,
    1065: 40,
    1068: 40,
    // Timewalking: Legion
    1263: 45,
    1265: 45,
    1267: 45,
    1269: 45,
    1271: 45,
    1273: 45,
    1275: 45,
    1277: 45,
};

export const holidayIds: Record<number, number[]> = {
    [Holiday.Anniversary]: [
        467, 484, 509, 514, 566, 589, 590, 693, 807, 808, 1181, 1225, 1262, 1397, 1500, 1501, 1509,
        1587, 1588, 1589, 1590, 1592, 1593, 1594, 1595,
    ],
    [Holiday.Brewfest]: [372],
    [Holiday.ChildrensWeek]: [201],
    [Holiday.DarkmoonFaire]: [479],
    [Holiday.DayOfTheDead]: [409],
    [Holiday.HallowsEnd]: [324, 1405],
    [Holiday.LoveIsInTheAir]: [335, 423],
    [Holiday.LunarFestival]: [327],
    [Holiday.MidsummerFireFestival]: [11],
    [Holiday.Noblegarden]: [181],
    [Holiday.PilgrimsBounty]: [404],
    [Holiday.TrialOfStyle]: [691],
    [Holiday.WinterVeil]: [141],

    [Holiday.BonusArenaSkirmish]: [561, 610, 611, 612],
    [Holiday.BonusBattleground]: [563, 602, 603, 604],
    [Holiday.BonusDelve]: [1559, 1560, 1561, 1562],
    [Holiday.BonusDungeon]: [1558, 1563, 1564, 1565],
    [Holiday.BonusPetBattle]: [565, 599, 600, 601],
    [Holiday.BonusWorldQuest]: [592, 613, 614, 615],

    [Holiday.TimewalkingClassic]: [1508, 1583, 1584, 1585],
    [Holiday.TimewalkingTbc]: [559, 622, 623, 624],
    [Holiday.TimewalkingWotlk]: [562, 616, 617, 618],
    [Holiday.TimewalkingCata]: [587, 628, 629, 630],
    [Holiday.TimewalkingMop]: [643, 652, 654, 656],
    [Holiday.TimewalkingWod]: [1056, 1063, 1065, 1068],
    [Holiday.TimewalkingLegion]: [1263, 1265, 1267, 1269, 1271, 1273, 1275, 1277],
    [Holiday.TimewalkingBfa]: [1666, 1667, 1668, 1669],

    [Holiday.BrawlArathiBlizzard]: [666, 673, 680, 697, 737],
    [Holiday.BrawlClassicAshran]: [1120, 1121, 1122, 1123, 1124],
    [Holiday.BrawlCompStomp]: [1234, 1235, 1236, 1237, 1238],
    [Holiday.BrawlCookingImpossible]: [1047, 1048, 1049, 1050, 1051],
    [Holiday.BrawlDeepSix]: [702, 704, 705, 706, 736],
    [Holiday.BrawlDeepwindDunk]: [1239, 1240, 1241, 1242, 1243],
    [Holiday.BrawlGravityLapse]: [659, 663, 670, 677, 684],
    [Holiday.BrawlPackedHouse]: [667, 674, 681, 688, 701],
    [Holiday.BrawlShadoPanShowdown]: [1232, 1233, 1244, 1245, 1246, 1312],
    [Holiday.BrawlSouthshoreVsTarrenMill]: [660, 662, 669, 676, 683],
    [Holiday.BrawlTempleOfHotmogu]: [1166, 1167, 1168, 1169, 1170],
    [Holiday.BrawlWarsongScramble]: [664, 671, 678, 685, 1221],

    [Holiday.RemixLegion]: [1640, 1641, 1642, 1643, 1644, 1697],
};

export const holidayMap: Record<number, Holiday> = Object.fromEntries(
    getNumberKeyedEntries(holidayIds)
        .map(([key, values]) => values.map((id) => [id, key]))
        .flat()
);

export type FancyHoliday = {
    everything?: string;
    holiday: Holiday;
    shortName: string;
};
export const fancyHolidays: FancyHoliday[] = [
    {
        holiday: Holiday.Brewfest,
        shortName: 'Brewfest',
        everything: 'brewfest',
    },
    {
        holiday: Holiday.ChildrensWeek,
        shortName: 'Children',
        everything: 'childrens-week',
    },
    {
        holiday: Holiday.DarkmoonFaire,
        shortName: 'DMF',
        everything: 'darkmoon-faire',
    },
    {
        holiday: Holiday.DayOfTheDead,
        shortName: '💀',
        everything: 'day-of-the-dead',
    },
    {
        holiday: Holiday.HallowsEnd,
        shortName: '🎃',
        everything: 'hallows-end',
    },
    {
        holiday: Holiday.LoveIsInTheAir,
        shortName: '💘',
        everything: 'love-is-in-the-air',
    },
    {
        holiday: Holiday.LunarFestival,
        shortName: 'Lunar Festival',
        everything: 'lunar-festival',
    },
    {
        holiday: Holiday.MidsummerFireFestival,
        shortName: 'Midsummer',
        everything: 'midsummer-fire-festival',
    },
    {
        holiday: Holiday.Noblegarden,
        shortName: 'Noblegarden',
        everything: 'noblegarden',
    },
    {
        holiday: Holiday.PilgrimsBounty,
        shortName: '🦃',
        everything: 'pilgrims-bounty',
    },
    {
        holiday: Holiday.TrialOfStyle,
        shortName: 'Trial of Style',
        everything: 'trial-of-style',
    },
    {
        holiday: Holiday.WinterVeil,
        shortName: 'Winter Veil',
        everything: 'winter-veil',
    },
    //
    {
        holiday: Holiday.Anniversary,
        shortName: 'Anni',
        everything: 'anniversary',
    },
    {
        holiday: Holiday.RemixLegion,
        shortName: 'Lemix',
        everything: 'remix-legion',
    },
];
