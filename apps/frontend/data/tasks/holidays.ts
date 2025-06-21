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
            taskKey: 'anniversaryCelebrate',
            taskName: 'Celebrate',
            couldGetFunc: (char) => char.auras?.[465631]?.duration > 0,
        },
        {
            taskKey: 'anniversaryChromie',
            taskName: "Chromie's Codex",
        },
        // {
        //     taskKey: 'anniversaryOriginals',
        //     taskName: 'The Originals',
        //     minimumLevel: 30,
        // },
        {
            taskKey: 'anniversaryGatecrashers',
            taskName: 'Timely Gate Crashers',
            minimumLevel: 30,
        },
        {
            taskKey: 'anniversaryReflect',
            taskName: 'Reflect',
        },
        {
            taskKey: 'anniversarySoldier',
            taskName: 'Alterac Valley',
        },
    ],
    holidayDarkmoonFaire: [
        {
            taskKey: 'dmfStrength',
            taskName: 'Test Your Strength',
        },
        {
            taskKey: 'dmfDenmother',
            taskName: 'Kill Moonfang',
        },
        // Items
        {
            taskKey: 'dmfStrategist',
            taskName: '{itemWithIcon:71715}', // A Treatise on Strategy
        },
        {
            taskKey: 'dmfBanner',
            taskName: '{itemWithIcon:71951}', // Banner of the Fallen
        },
        {
            taskKey: 'dmfInsignia',
            taskName: '{itemWithIcon:71952}', // Captured Insignia
        },
        {
            taskKey: 'dmfJournal',
            taskName: '{itemWithIcon:71953}', // Fallen Adventurer's Journal
        },
        {
            taskKey: 'dmfCrystal',
            taskName: '{itemWithIcon:71635}', // Imbued Crystal
        },
        {
            taskKey: 'dmfEgg',
            taskName: '{itemWithIcon:71636}', // Monstrous Egg
        },
        {
            taskKey: 'dmfGrimoire',
            taskName: '{itemWithIcon:71637}', // Mysterious Grimoire
        },
        {
            taskKey: 'dmfWeapon',
            taskName: '{itemWithIcon:71638}', // Ornate Weapon
        },
        {
            taskKey: 'dmfDivination',
            taskName: '{itemWithIcon:71716}', // Soothsayer's Runes
        },
        // Professions
        {
            taskKey: 'dmfAlchemy',
            taskName: ':alchemy: A Fizzy Fusion',
            couldGetFunc: (char) => !!char.professions?.[Profession.Alchemy],
        },
        {
            taskKey: 'dmfBlacksmithing',
            taskName: ':blacksmithing: Baby Needs Two Pair of Shoes',
            couldGetFunc: (char) => !!char.professions?.[Profession.Blacksmithing],
        },
        {
            taskKey: 'dmfEnchanting',
            taskName: ':enchanting: Putting Trash to Good Use',
            couldGetFunc: (char) => !!char.professions?.[Profession.Enchanting],
        },
        {
            taskKey: 'dmfEngineering',
            taskName: ":engineering: Talkin' Tonks",
            couldGetFunc: (char) => !!char.professions?.[Profession.Engineering],
        },
        {
            taskKey: 'dmfHerbalism',
            taskName: ':herbalism: Herbs for Healing',
            couldGetFunc: (char) => !!char.professions?.[Profession.Herbalism],
        },
        {
            taskKey: 'dmfInscription',
            taskName: ':inscription: Writing the Future',
            couldGetFunc: (char) => !!char.professions?.[Profession.Inscription],
        },
        {
            taskKey: 'dmfJewelcrafting',
            taskName: ':jewelcrafting: Keeping the Faire Sparkling',
            couldGetFunc: (char) => !!char.professions?.[Profession.Jewelcrafting],
        },
        {
            taskKey: 'dmfLeatherworking',
            taskName: ':leatherworking: Eyes on the Prizes',
            couldGetFunc: (char) => !!char.professions?.[Profession.Leatherworking],
        },
        {
            taskKey: 'dmfMining',
            taskName: ':mining: Rearm, Reuse, Recycle',
            couldGetFunc: (char) => !!char.professions?.[Profession.Mining],
        },
        {
            taskKey: 'dmfSkinning',
            taskName: ':skinning: Tan My Hide',
            couldGetFunc: (char) => !!char.professions?.[Profession.Skinning],
        },
        {
            taskKey: 'dmfTailoring',
            taskName: ':tailoring: Banners, Banners Everywhere!',
            couldGetFunc: (char) => !!char.professions?.[Profession.Tailoring],
        },
        {
            taskKey: 'dmfArchaeology',
            taskName: ':archaeology: Fun for the Little Ones',
            couldGetFunc: (char) => !!char.professions?.[Profession.Archaeology],
        },
        {
            taskKey: 'dmfCooking',
            taskName: ':cooking: Putting the Crunch in the Frog',
            couldGetFunc: (char) => !!char.professions?.[Profession.Cooking],
        },
        {
            taskKey: 'dmfFishing',
            taskName: ":fishing: Spoilin' for Salty Sea Dogs",
            couldGetFunc: (char) => !!char.professions?.[Profession.Fishing],
        },
    ],
    holidayHallowsEnd: [
        {
            taskKey: 'hallowsBuild',
            taskName: 'Bonfire',
            minimumLevel: 10,
        },
        {
            taskKey: 'hallowsBreak',
            taskName: 'Douse',
            minimumLevel: 10,
        },
        {
            taskKey: 'hallowsCleanUp',
            taskName: 'Clean Up',
            minimumLevel: 10,
        },
        {
            taskKey: 'hallowsStinkBombs',
            taskName: 'Stink Bombs',
            minimumLevel: 10,
        },
        {
            taskKey: 'hallowsTree',
            taskName: 'The Crooked Tree',
            minimumLevel: 40,
        },
    ],
    holidayLove: [
        {
            taskKey: 'loveCrownAccount',
            taskName: 'Crown Chemical Co. [Account]',
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
            taskKey: 'loveDonation',
            taskName: 'Donate',
            noProgress: true,
            questIds: [78683],
            questReset: DbResetType.Daily,
        },
        {
            taskKey: 'loveGetaway',
            taskName: 'Getaway',
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
            taskKey: 'loveGift',
            taskName: 'Gift',
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
    holidayNoblegarden: [
        {
            minimumLevel: 60,
            taskKey: 'nobleDaetan',
            taskName: 'Feathered Fiend',
            questIds: [
                73192, // Feathered Fiend [A]
                79558, // Feathered Fiend [H]
            ],
            questReset: DbResetType.Daily,
        },
        {
            minimumLevel: 1,
            taskKey: 'nobleQuacking',
            taskName: 'Quacking Down',
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
            taskKey: 'nobleEggs',
            taskName: 'The Great Egg Hunt',
            questIds: [
                13480, // The Great Egg Hunt [A]
                13479, // The Great Egg Hunt [H]
            ],
            questReset: DbResetType.Daily,
        },
    ],
    holidayWinterVeil: [
        {
            minimumLevel: Constants.characterMaxLevel - 10,
            taskKey: 'merryMeanOne',
            taskName: "...You're a Mean One",
        },
        {
            minimumLevel: 30,
            maximumLevel: Constants.characterMaxLevel - 11,
            taskKey: 'merryMeanOneSplit',
            taskName: `...You're a Mean One (<${Constants.characterMaxLevel - 10})`,
        },
        {
            minimumLevel: 40,
            taskKey: 'merryGrumpus',
            taskName: 'Grumpus',
            couldGetFunc: winterVeilCouldGet,
        },
        {
            minimumLevel: 40,
            taskKey: 'merryGrumplings',
            taskName: 'Menacing Grumplings',
            couldGetFunc: winterVeilCouldGet,
        },
        {
            minimumLevel: 40,
            taskKey: 'merryPresents',
            taskName: 'What Horrible Presents!',
            couldGetFunc: winterVeilCouldGet,
        },
        {
            minimumLevel: 40,
            taskKey: 'merryChildren',
            taskName: 'Where Are the Children?',
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
            taskKey: 'twDungeonsNotMax',
            taskName: `Timewalking Dungeons &lt; ${Constants.characterMaxLevel}`,
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
            taskKey: 'twDungeonsMax',
            taskName: `Timewalking Dungeons @ ${Constants.characterMaxLevel}`,
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
