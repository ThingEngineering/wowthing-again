import { Constants } from '@/data/constants';
import { Profession } from '@/enums/profession';
import { DbResetType } from '@/shared/stores/db/enums';
import { userState } from '@/user-home/state/user';
import type { Character } from '@/types';
import type { Chore, Task } from '@/types/tasks';

// Actual holidays
function winterVeilCouldGet(char: Character): boolean {
    return [36615, 36614].some((questId) =>
        userState.quests.characterById.get(char.id).hasQuestById.has(questId)
    );
}

export const actualHolidayTasks: Task[] = [
    {
        key: 'anniversary',
        minimumLevel: 10,
        name: "[Event] WoW's Anniversary",
        shortName: 'Anni',
        type: 'multi',
    },
    {
        key: 'holidayDarkmoonFaire',
        minimumLevel: 1,
        name: '[Event] Darkmoon Faire',
        shortName: 'DMF',
        type: 'multi',
    },
    {
        key: 'holidayHallowsEnd',
        minimumLevel: 10,
        name: "[Event] Hallow's End",
        shortName: '🎃',
        type: 'multi',
    },
    {
        key: 'holidayLove',
        minimumLevel: 10,
        name: '[Event] Love is in the Air',
        shortName: '💘',
        type: 'multi',
    },
    {
        key: 'holidayMidsummer',
        minimumLevel: 10,
        name: '[Event] Midsummer Fire Festival',
        shortName: '🔥',
        type: 'multi',
    },
    {
        key: 'holidayNoblegarden',
        minimumLevel: 1,
        name: '[Event] Noblegarden',
        shortName: '🐰',
        type: 'multi',
    },
    {
        key: 'holidayWinterVeil',
        minimumLevel: 30,
        name: '[Event] Winter Veil',
        shortName: 'Xmas',
        type: 'multi',
    },
];

export const actualHolidayChores: Record<string, Chore[]> = {
    anniversary: [
        {
            key: 'anniversaryCelebrate',
            name: 'Celebrate',
            couldGetFunc: (char) => char.auras?.[465631]?.duration > 0,
        },
        {
            key: 'anniversaryChromie',
            name: "Chromie's Codex",
        },
        // {
        //     taskKey: 'anniversaryOriginals',
        //     taskName: 'The Originals',
        //     minimumLevel: 30,
        // },
        {
            key: 'anniversaryGatecrashers',
            name: 'Timely Gate Crashers',
            minimumLevel: 30,
        },
        {
            key: 'anniversaryReflect',
            name: 'Reflect',
        },
        {
            key: 'anniversarySoldier',
            name: 'Alterac Valley',
        },
    ],
    holidayDarkmoonFaire: [
        {
            key: 'dmfStrength',
            name: 'Test Your Strength',
        },
        {
            key: 'dmfDenmother',
            name: 'Kill Moonfang',
        },
        // Items
        {
            key: 'dmfStrategist',
            name: '{itemWithIcon:71715}', // A Treatise on Strategy
        },
        {
            key: 'dmfBanner',
            name: '{itemWithIcon:71951}', // Banner of the Fallen
        },
        {
            key: 'dmfInsignia',
            name: '{itemWithIcon:71952}', // Captured Insignia
        },
        {
            key: 'dmfJournal',
            name: '{itemWithIcon:71953}', // Fallen Adventurer's Journal
        },
        {
            key: 'dmfCrystal',
            name: '{itemWithIcon:71635}', // Imbued Crystal
        },
        {
            key: 'dmfEgg',
            name: '{itemWithIcon:71636}', // Monstrous Egg
        },
        {
            key: 'dmfGrimoire',
            name: '{itemWithIcon:71637}', // Mysterious Grimoire
        },
        {
            key: 'dmfWeapon',
            name: '{itemWithIcon:71638}', // Ornate Weapon
        },
        {
            key: 'dmfDivination',
            name: '{itemWithIcon:71716}', // Soothsayer's Runes
        },
        // Professions
        {
            key: 'dmfAlchemy',
            name: ':alchemy: A Fizzy Fusion',
            couldGetFunc: (char) => !!char.professions?.[Profession.Alchemy],
        },
        {
            key: 'dmfBlacksmithing',
            name: ':blacksmithing: Baby Needs Two Pair of Shoes',
            couldGetFunc: (char) => !!char.professions?.[Profession.Blacksmithing],
        },
        {
            key: 'dmfEnchanting',
            name: ':enchanting: Putting Trash to Good Use',
            couldGetFunc: (char) => !!char.professions?.[Profession.Enchanting],
        },
        {
            key: 'dmfEngineering',
            name: ":engineering: Talkin' Tonks",
            couldGetFunc: (char) => !!char.professions?.[Profession.Engineering],
        },
        {
            key: 'dmfHerbalism',
            name: ':herbalism: Herbs for Healing',
            couldGetFunc: (char) => !!char.professions?.[Profession.Herbalism],
        },
        {
            key: 'dmfInscription',
            name: ':inscription: Writing the Future',
            couldGetFunc: (char) => !!char.professions?.[Profession.Inscription],
        },
        {
            key: 'dmfJewelcrafting',
            name: ':jewelcrafting: Keeping the Faire Sparkling',
            couldGetFunc: (char) => !!char.professions?.[Profession.Jewelcrafting],
        },
        {
            key: 'dmfLeatherworking',
            name: ':leatherworking: Eyes on the Prizes',
            couldGetFunc: (char) => !!char.professions?.[Profession.Leatherworking],
        },
        {
            key: 'dmfMining',
            name: ':mining: Rearm, Reuse, Recycle',
            couldGetFunc: (char) => !!char.professions?.[Profession.Mining],
        },
        {
            key: 'dmfSkinning',
            name: ':skinning: Tan My Hide',
            couldGetFunc: (char) => !!char.professions?.[Profession.Skinning],
        },
        {
            key: 'dmfTailoring',
            name: ':tailoring: Banners, Banners Everywhere!',
            couldGetFunc: (char) => !!char.professions?.[Profession.Tailoring],
        },
        {
            key: 'dmfArchaeology',
            name: ':archaeology: Fun for the Little Ones',
            couldGetFunc: (char) => !!char.professions?.[Profession.Archaeology],
        },
        {
            key: 'dmfCooking',
            name: ':cooking: Putting the Crunch in the Frog',
            couldGetFunc: (char) => !!char.professions?.[Profession.Cooking],
        },
        {
            key: 'dmfFishing',
            name: ":fishing: Spoilin' for Salty Sea Dogs",
            couldGetFunc: (char) => !!char.professions?.[Profession.Fishing],
        },
    ],
    holidayHallowsEnd: [
        {
            key: 'hallowsBuild',
            name: 'Bonfire',
            minimumLevel: 10,
        },
        {
            key: 'hallowsBreak',
            name: 'Douse',
            minimumLevel: 10,
        },
        {
            key: 'hallowsCleanUp',
            name: 'Clean Up',
            minimumLevel: 10,
        },
        {
            key: 'hallowsStinkBombs',
            name: 'Stink Bombs',
            minimumLevel: 10,
        },
        {
            key: 'hallowsTree',
            name: 'The Crooked Tree',
            minimumLevel: 40,
        },
    ],
    holidayLove: [
        {
            key: 'loveCrownAccount',
            name: 'Crown Chemical Co. [Account]',
            accountWide: true,
            noProgress: true,
            questIds: [
                74957, // X-45 Heartbreaker
                79104, // Renewed Proto-Drake: Love Armor
                86172, // Love Witch's Sweeper
            ],
            questReset: DbResetType.Daily,
        },
        {
            key: 'loveDonation',
            name: 'Donate',
            noProgress: true,
            questIds: [78683],
            questReset: DbResetType.Daily,
        },
        {
            key: 'loveGetaway',
            name: 'Getaway',
            questIds: [
                78594, // Getaway to Scenic Feralas! [A]
                78988, // Getaway to Scenic Feralas! [H]
                78565, // Getaway to Scenic Grizzly Hills! [A]
                78986, // Getaway to Scenic Grizzly Hills! [H]
                78591, // Getaway to Scenic Nagrand! [A]
                78987, // Getaway to Scenic Nagrand! [H]
            ],
            questReset: DbResetType.Daily,
        },
        {
            key: 'loveGift',
            name: 'Gift',
            questIds: [
                78679, // The Gift of Relaxation [A]
                78991, // The Gift of Relaxation [H]
                78674, // The Gift of Relief [A]
                78990, // The Gift of Relief [H]
                78724, // The Gift of Self-Care [Duel, A]
                78992, // The Gift of Self-Care [Duel, H]
                78726, // The Gift of Self-Care [Eat, A]
                78993, // The Gift of Self-Care [Eat, H]
                78727, // The Gift of Self-Care [Nap, A]
                78979, // The Gift of Self-Care [Nap, H]
            ],
            questReset: DbResetType.Daily,
        },
    ],
    holidayMidsummer: [
        {
            minimumLevel: 10,
            key: 'midsummerAhune',
            name: 'Ahune [Account]',
            accountWide: true,
            questIds: [83134],
            questReset: DbResetType.Daily,
        },
    ],
    holidayNoblegarden: [
        {
            minimumLevel: 60,
            key: 'nobleDaetan',
            name: 'Feathered Fiend',
            questIds: [
                73192, // Feathered Fiend [A]
                79558, // Feathered Fiend [H]
            ],
            questReset: DbResetType.Daily,
        },
        {
            minimumLevel: 1,
            key: 'nobleQuacking',
            name: 'Quacking Down',
            questIds: [
                78274, // Quacking Down [A]
                79135, // Quacking Down [H]
            ],
            questReset: DbResetType.Daily,
            couldGetFunc: (char) =>
                [79322, 79575].some((questId) =>
                    userState.quests.characterById.get(char.id).hasQuestById.has(questId)
                ),
        },
        {
            minimumLevel: 1,
            key: 'nobleEggs',
            name: 'The Great Egg Hunt',
            questIds: [
                13480, // The Great Egg Hunt [A]
                13479, // The Great Egg Hunt [H]
            ],
            questReset: DbResetType.Daily,
        },
    ],
    holidayWinterVeil: [
        {
            key: 'merryMeanOneHigh',
            name: `...You're a Mean One &gte; ${Constants.characterMaxLevel - 10}`,
            minimumLevel: Constants.characterMaxLevel - 10,
        },
        {
            key: 'merryMeanOneLow',
            name: `...You're a Mean One &lt; ${Constants.characterMaxLevel - 10}`,
            minimumLevel: 30,
            maximumLevel: Constants.characterMaxLevel - 11,
        },
        {
            minimumLevel: 40,
            key: 'merryGrumpus',
            name: 'Grumpus',
            couldGetFunc: winterVeilCouldGet,
        },
        {
            minimumLevel: 40,
            key: 'merryGrumplings',
            name: 'Menacing Grumplings',
            couldGetFunc: winterVeilCouldGet,
        },
        {
            minimumLevel: 40,
            key: 'merryPresents',
            name: 'What Horrible Presents!',
            couldGetFunc: winterVeilCouldGet,
        },
        {
            minimumLevel: 40,
            key: 'merryChildren',
            name: 'Where Are the Children?',
            couldGetFunc: winterVeilCouldGet,
        },
    ],
};

// Weekly "holidays". This name sucks
export const weeklyHolidayTasks: Task[] = [
    {
        key: 'holidayArena',
        name: '[Event] Arena Skirmishes',
        shortName: 'Arena',
    },
    {
        key: 'holidayBattlegrounds',
        name: '[Event] Battlegrounds',
        shortName: 'BGs',
    },
    {
        key: 'holidayDelves',
        name: '[Event] Delves',
        shortName: 'Delv',
    },
    {
        key: 'holidayDungeons',
        name: '[Event] Dungeons',
        shortName: 'Dun',
    },
    {
        key: 'holidayPetPvp',
        name: '[Event] Pet PvP',
        shortName: 'Pets',
    },
    {
        key: 'holidayTimewalking',
        name: '[Event] Timewalking Dungeons',
        shortName: 'TW :exclamation:',
        minimumLevel: 10,
        type: 'multi',
    },
    {
        key: 'holidayTimewalkingItem',
        name: '[Event] Timewalking Item',
        shortName: 'TW :item:',
        minimumLevel: 10,
        questIds: [
            83285, // Classic
            40168, // TBC
            40173, // WotLK
            40787, // Cata [A]
            40788, // Cata [H]
            45563, // MoP
            55498, // WoD [A]
            55499, // WoD [H]
            64710, // Legion
            89222, // BfA [A]
            89223, // BfA [H]
        ],
        questReset: DbResetType.Weekly,
    },
    {
        key: 'holidayTimewalkingRaid',
        name: '[Event] Timewalking Raid',
        shortName: 'TW :rocket:',
        minimumLevel: 30,
        questIds: [
            47523, // TBC [Black Temple]
            50316, // WotLK [Ulduar]
            57637, // Cata [Firelands]
        ],
        questReset: DbResetType.Weekly,
    },
    {
        key: 'holidayWorldQuests',
        name: '[Event] World Quests',
        shortName: 'WQs',
    },
];

export const holidayTimewalkingChores: Record<string, Chore[]> = {
    holidayTimewalking: [
        {
            key: 'twDungeonsNotMax',
            name: `Timewalking Dungeons &lt; ${Constants.characterMaxLevel}`,
            minimumLevel: 10,
            maximumLevel: Constants.characterMaxLevel - 1,
            questIds: [
                85947, // An Original Journey Through Time [Classic]
                85948, // A Burning Journey Through Time [TBC]
                85949, // A Frozen Journey Through Time [Wrath]
                86556, // A Shattered Journey Through Time [Cata]
                86560, // A Shrouded Journey Through Time [MoP]
                86563, // A Savage Journey Through Time [WoD]
                86564, // A Fel Journey Through Time [Legion]
                88808, // A Scarred Journey Through Time [BfA]
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twDungeonsMax',
            name: `Timewalking Dungeons @ ${Constants.characterMaxLevel}`,
            minimumLevel: Constants.characterMaxLevel,
            questIds: [
                83274, // An Original Path Through Time [Classic]
                83363, // A Burning Path Through Time [TBC]
                83365, // A Frozen Path Through Time [Wrath]
                83359, // A Shattered Path Through Time [Cata]
                83362, // A Shrouded Path Through Time [MoP]
                83364, // A Savage Path Through Time [WoD]
                83360, // A Fel Path Through Time [Legion]
                88805, // A Scarred Path Through Time [BfA]
            ],
            questReset: DbResetType.Weekly,
        },
    ],
};
