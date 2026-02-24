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

// Holiday enum => [[StaticDataHoliday.nameIds], [StaticDataHoliday.descriptionIds]?]
const timewalkingNameIds = [237, 239];
export const holidayIds: Record<number, [number[], number[]?]> = {
    [Holiday.Anniversary]: [[242, 439]],
    [Holiday.Brewfest]: [[19]],
    [Holiday.ChildrensWeek]: [[13]],
    [Holiday.DarkmoonFaire]: [[1]],
    [Holiday.DayOfTheDead]: [[81]],
    [Holiday.HallowsEnd]: [[16]],
    [Holiday.LoveIsInTheAir]: [[9]],
    [Holiday.LunarFestival]: [[18]],
    [Holiday.MidsummerFireFestival]: [[11]],
    [Holiday.Noblegarden]: [[15]],
    [Holiday.PilgrimsBounty]: [[101]],
    [Holiday.PiratesDay]: [[21]],
    [Holiday.TrialOfStyle]: [[258]],
    [Holiday.WinterVeil]: [[14]],

    [Holiday.BonusArenaSkirmish]: [[238]],
    [Holiday.BonusBattleground]: [[236]],
    [Holiday.BonusDelve]: [[442]],
    [Holiday.BonusDungeon]: [[441]], // changes each expansion
    [Holiday.BonusPetBattle]: [[234]],
    [Holiday.BonusWorldQuest]: [[244]],

    [Holiday.TimewalkingClassic]: [timewalkingNameIds, [465]],
    [Holiday.TimewalkingTbc]: [timewalkingNameIds, [222]],
    [Holiday.TimewalkingWotlk]: [timewalkingNameIds, [220]],
    [Holiday.TimewalkingCata]: [timewalkingNameIds, [224]],
    [Holiday.TimewalkingMop]: [timewalkingNameIds, [237]],
    [Holiday.TimewalkingWod]: [timewalkingNameIds, [382]],
    [Holiday.TimewalkingLegion]: [timewalkingNameIds, [417]],
    [Holiday.TimewalkingBfa]: [timewalkingNameIds, [483]],
    [Holiday.TimewalkingSl]: [timewalkingNameIds, [492]],

    [Holiday.BrawlArathiBlizzard]: [[262]],
    [Holiday.BrawlClassicAshran]: [[398]],
    [Holiday.BrawlCompStomp]: [[395]],
    [Holiday.BrawlCookingImpossible]: [[391]],
    [Holiday.BrawlDeepSix]: [[267]],
    [Holiday.BrawlDeepwindDunk]: [[263]],
    [Holiday.BrawlGravityLapse]: [[255]],
    [Holiday.BrawlPackedHouse]: [[265]],
    [Holiday.BrawlShadoPanShowdown]: [[268]],
    [Holiday.BrawlSouthshoreVsTarrenMill]: [[256]],
    [Holiday.BrawlTempleOfHotmogu]: [[400]],
    [Holiday.BrawlWarsongScramble]: [[257]],

    [Holiday.CupEasternKingdoms]: [[427]], // Classic
    [Holiday.CupKalimdor]: [[424]], // Classic
    [Holiday.CupOutland]: [[428]], // TBC
    [Holiday.CupNorthrend]: [[431]], // WotLK
    [Holiday.CupPandaria]: [[432]], // MoP
    [Holiday.CupBrokenIsles]: [[433]], // Legion

    [Holiday.PrepatchMidnight]: [[450]],
    [Holiday.RemixLegion]: [[447]],
};

export type FancyHoliday = {
    everything?: string;
    holiday: Holiday;
    shortName: string;
};
export const fancyHolidays: FancyHoliday[] = [
    {
        holiday: Holiday.Brewfest,
        shortName: '🍻',
        everything: 'brewfest',
    },
    {
        holiday: Holiday.ChildrensWeek,
        shortName: 'Children',
        everything: 'childrens-week',
    },
    {
        holiday: Holiday.DarkmoonFaire,
        shortName: '🎡',
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
        shortName: '🌛',
        everything: 'lunar-festival',
    },
    {
        holiday: Holiday.MidsummerFireFestival,
        shortName: 'Midsummer',
        everything: 'midsummer-fire-festival',
    },
    {
        holiday: Holiday.Noblegarden,
        shortName: '🐰',
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
        shortName: '🎅',
        everything: 'winter-veil',
    },
    // Flying Cups
    {
        holiday: Holiday.CupEasternKingdoms, // Classic
        shortName: 'Eastern Kingdoms 🛩️',
        everything: 'cup-eastern-kingdoms',
    },
    {
        holiday: Holiday.CupKalimdor, // Classic
        shortName: 'Kalimdor 🛩️',
        everything: 'cup-kalimdor',
    },
    {
        holiday: Holiday.CupOutland, // TBC
        shortName: 'Outland 🛩️',
        everything: 'cup-outland',
    },
    {
        holiday: Holiday.CupNorthrend, // WotLK
        shortName: 'Northrend 🛩️',
        everything: 'cup-northrend',
    },
    {
        holiday: Holiday.CupPandaria, // MoP
        shortName: 'Pandaria 🛩️',
        everything: 'cup-pandaria',
    },
    {
        holiday: Holiday.CupBrokenIsles, // Legion
        shortName: 'Broken Isles 🛩️',
        everything: 'cup-broken-isles',
    },

    //
    {
        holiday: Holiday.Anniversary,
        shortName: 'Anni',
        everything: 'anniversary',
    },
    {
        holiday: Holiday.PrepatchMidnight,
        shortName: 'Prepatch',
        everything: 'prepatch-midnight',
    },
    {
        holiday: Holiday.RemixLegion,
        shortName: 'Lemix',
        everything: 'remix-legion',
    },
];
