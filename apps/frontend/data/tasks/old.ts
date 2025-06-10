import { Constants } from '@/data/constants';
import {
    dragonflightProfessions,
    isGatheringProfession,
    warWithinProfessions,
} from '@/data/professions';
import { Holiday } from '@/enums/holiday';
import { Profession } from '@/enums/profession';
import { DbResetType } from '@/shared/stores/db/enums';
import { userQuestStore } from '@/stores';
import type { Character } from '@/types';
import type { TaskProfession } from '@/types/data';
import type { Chore, Task } from '@/types/tasks';

import { eventsTurboBoost } from './events';
import {
    twwChores11_0,
    twwChores11_1,
    twwChores11_1_5,
    twwChoresChett,
    twwHorrificVisions,
} from './the_war_within';
import { wowthingData } from '@/shared/stores/data';

const nameFire = '<span class="status-warn">:fire:</span>';
const nameQuest = '<span class="status-shrug">:exclamation:</span>';

const somethingDifferent = [47148];

function buildProfessionTasks(
    professions: TaskProfession[],
    expansion: number,
    prefix: string,
    minimumLevel: number
): Chore[] {
    return professions.flatMap((profession) => {
        const name = Profession[profession.id];
        const tasks: Chore[] = [];

        if (prefix === 'df') {
            tasks.push({
                taskKey: `${prefix}Profession${name}Provide`,
                taskName: `${name}: Provide`,
                minimumLevel,
                couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
                canGetFunc: (char) =>
                    getExpansionSkill(char, profession.id, Constants.expansion, 45),
            });
        }

        if (profession.hasTasks === true) {
            tasks.push({
                taskKey: `${prefix}Profession${name}Task`,
                taskName: `${name}: Task`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
                canGetFunc: (char) =>
                    getExpansionSkill(
                        char,
                        profession.id,
                        expansion,
                        expansion === 9 && isGatheringProfession[profession.id] ? 45 : 25
                    ),
            });
        }

        tasks.push({
            taskKey: `${prefix}Profession${name}Drop#`,
            taskName: `${name}: Drops`,
            minimumLevel,
            couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
            //canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
        });

        if (profession.hasOrders === true) {
            tasks.push({
                taskKey: `${prefix}Profession${name}Orders`,
                taskName: `${name}: Orders`,
                minimumLevel,
                couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
                canGetFunc: (char) =>
                    getExpansionSkill(char, profession.id, expansion, expansion === 9 ? 25 : 1),
            });
        }

        tasks.push({
            taskKey: `${prefix}Profession${name}Treatise`,
            taskName: `${name}: Treatise`,
            minimumLevel,
            couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
        });

        return tasks;
    });
}

export const dragonflightProfessionTasks = buildProfessionTasks(
    dragonflightProfessions,
    9,
    'df',
    60
);
export const warWithinProfessionTasks = buildProfessionTasks(warWithinProfessions, 10, 'tww', 60);

export const taskList: Task[] = [
    // Events/Holidays/idk
    {
        key: 'turboBoost',
        minimumLevel: 80,
        name: '[Event] Turbo Boost',
        shortName: 'Turbo',
        type: 'multi',
    },
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

    // Weekly Holidays
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
    },
    {
        key: 'holidayTimewalkingItem',
        name: '[Event] Timewalking Item',
        shortName: 'TW :item:',
        minimumLevel: 10,
    },
    {
        key: 'holidayTimewalkingRaid',
        name: '[Event] Timewalking Raid',
        shortName: 'TW :rocket:',
        minimumLevel: 30,
    },
    {
        key: 'holidayWorldQuests',
        name: '[Event] World Quests',
        shortName: 'WQs',
    },

    // PvP
    {
        key: 'pvpOverwhelmingOdds',
        name: '[PvP] Overwhelming Odds',
        shortName: 'WM',
    },
    {
        key: 'pvpBlitz',
        minimumLevel: 70,
        name: '[PvP] Battleground Blitz',
        shortName: 'Blitz',
        type: 'multi',
    },
    {
        key: 'pvpBrawl',
        name: '[PvP] Brawl',
        shortName: 'Brawl',
        type: 'multi',
    },
    {
        key: 'pvpSkirmishes',
        name: '[PvP] Arena Skirmishes',
        shortName: 'Skirm',
    },
    {
        key: 'pvpWar',
        name: '[PvP] Epic Battlegrounds',
        shortName: 'EBGs',
    },
    {
        key: 'pvpBattle',
        name: '[PvP] Random Battlegrounds',
        shortName: 'BGs',
    },
    {
        key: 'pvpArenas',
        name: '[PvP] Rated Arenas',
        shortName: 'RA',
    },
    {
        key: 'pvpTeamwork',
        name: '[PvP] Rated Battlegrounds',
        shortName: 'RBGs',
    },
    {
        key: 'pvpSolo',
        name: '[PvP] Solo Shuffle',
        shortName: 'Solo',
    },

    // Warlords of Draenor
    {
        key: 'wodGarrison',
        name: '[WoD] Garrison Invasions',
        shortName: 'GInv',
        type: 'multi',
        minimumLevel: 10,
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
        key: 'slShapingFate',
        name: '[SL] Shaping Fate (Korthia)',
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
        key: 'slPatterns',
        name: '[SL] Patterns (Zereth Mortis)',
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
    {
        key: 'dfWorthyAllyLoammNiffen',
        name: '[DF] A Worthy Ally: Loamm Niffen',
        shortName: 'WA:LN',
        minimumLevel: 70,
    },
    {
        key: 'dfCatchRelease',
        name: '[DF] Catch and Release (Fishing)',
        shortName: 'CaR',
        type: 'multi',
    },
    {
        key: 'dfChores',
        name: '[DF] Chores - 10.0.x',
        shortName: '10.0',
        minimumLevel: 60,
        type: 'multi',
    },
    {
        key: 'dfChores10_1_0',
        name: '[DF] Chores - 10.1.x',
        shortName: '10.1',
        minimumLevel: 60,
        type: 'multi',
    },
    {
        key: 'dfChores10_2_0',
        name: '[DF] Chores - 10.2.x',
        shortName: '10.2',
        minimumLevel: 70,
        type: 'multi',
    },
    {
        key: 'dfProfessionWeeklies',
        name: '[DF] Profession Weeklies',
        shortName: 'DFP',
        type: 'multi',
        minimumLevel: 60,
    },
    {
        key: 'dfSparks',
        name: '[DF] Sparks of Life (PvP)',
        shortName: 'DF🌟',
        minimumLevel: 60,
    },
    {
        key: 'dfTimeRift',
        name: '[DF] Time Rifts',
        shortName: 'TR',
        minimumLevel: 60,
    },

    // The War Within
    {
        key: 'twwChores11_0',
        name: '[TWW] 11.0.x',
        shortName: '11.0',
        minimumLevel: 70,
        showSeparate: true,
        type: 'multi',
    },
    {
        key: 'twwChores11_1',
        name: '[TWW] 11.1.x',
        shortName: '11.1',
        minimumLevel: 80,
        showSeparate: true,
        type: 'multi',
    },
    {
        key: 'twwChoresChett',
        name: '[TWW] C.H.E.T.T. List',
        shortName: 'CHETT',
        minimumLevel: 80,
        type: 'multi',
    },
    {
        key: 'twwChores11_1_5',
        name: "[TWW] 11.1.5 Flame's Radiance",
        shortName: 'Rad',
        minimumLevel: 10,
        type: 'multi',
    },
    {
        key: 'twwHorrificVisions',
        name: '[TWW] Horrific Visions Revisited',
        shortName: 'Vis',
        minimumLevel: 80,
        type: 'multi',
    },
    {
        key: 'twwDelveKeys',
        name: '[TWW] Delves',
        shortName: 'Delve',
        minimumLevel: 80,
        type: 'multi',
    },
    {
        key: 'twwSpreading',
        name: '[TWW] Spreading the Light',
        shortName: 'StL',
        minimumLevel: 70,
        type: 'multi',
    },
    {
        key: 'twwProfessionWeeklies',
        name: '[TWW] Profession Weeklies',
        shortName: 'Pro',
        type: 'multi',
        minimumLevel: 70,
    },
    {
        key: 'twwSparks',
        name: '[TWW] Sparks of Life (PvP)',
        shortName: 'WW🌟',
        minimumLevel: 60,
    },

    // Misc
];

export const taskMap: Record<string, Task> = Object.fromEntries(
    taskList.map((task) => [task.key, task])
);

function garrisonCouldGet(char: Character): boolean {
    return userQuestStore.hasAny(char.id, 36592) || userQuestStore.hasAny(char.id, 36567);
}

function winterVeilCouldGet(char: Character): boolean {
    return userQuestStore.hasAny(char.id, 36615) || userQuestStore.hasAny(char.id, 36614);
}

export const multiTaskMap: Record<string, Chore[]> = {
    turboBoost: eventsTurboBoost,
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
                [79322, 79575].some((questId) => userQuestStore.hasAny(char.id, questId)),
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
    wodGarrison: [
        {
            taskKey: 'invasionBronze',
            taskName: '{item:120320}', // Invader's Abandoned Sack
            couldGetFunc: garrisonCouldGet,
            minimumLevel: 10,
        },
        {
            taskKey: 'invasionSilver',
            taskName: '{item:120319}', // Invader's Damaged Cache
            couldGetFunc: garrisonCouldGet,
            minimumLevel: 10,
        },
        {
            taskKey: 'invasionGold',
            taskName: '{item:116980}', // Invader's Forgotten Treasure
            couldGetFunc: garrisonCouldGet,
            minimumLevel: 10,
        },
        {
            taskKey: 'invasionPlatinum',
            taskName: '{item:122163}', // Routed Invader's Crate of Spoils
            couldGetFunc: garrisonCouldGet,
            minimumLevel: 10,
        },
    ],
    dfCatchRelease: [
        {
            taskKey: 'dfCatchAileron',
            taskName: 'Aileron Seamoth',
        },
        {
            taskKey: 'dfCatchCerulean',
            taskName: 'Cerulean Spinefish',
        },
        {
            taskKey: 'dfCatchIslefin',
            taskName: 'Islefin Dorado',
        },
        {
            taskKey: 'dfCatchScalebelly',
            taskName: 'Scalebelly Mackerel',
        },
        {
            taskKey: 'dfCatchTemporal',
            taskName: 'Temporal Dragonhead',
        },
        {
            taskKey: 'dfCatchThousandbite',
            taskName: 'Thousandbite Piranha',
        },
    ],
    dfChores: [
        {
            minimumLevel: 60,
            taskKey: 'dfCommunityFeast',
            taskName: 'Community Feast',
        },
        // { // actually daily
        //     taskKey: 'dfCommunityFeastKill',
        //     taskName: 'Community Feast: Boss',
        // },
        {
            taskKey: 'dfDragonAllegiance',
            taskName: 'Dragon selected',
        },
        {
            taskKey: 'dfDragonKey',
            taskName: 'Dragon key turned in',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfGrandHuntMythic',
            taskName: 'Grand Hunt: Epic',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfGrandHuntRare',
            taskName: 'Grand Hunt: Rare',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfGrandHuntUncommon',
            taskName: 'Grand Hunt: Uncommon',
        },
        {
            taskKey: 'dfPrimalStorm',
            taskName: 'Primal Storm: Air',
        },
        {
            taskKey: 'dfPrimalEarth',
            taskName: 'Primal Storm: Earth',
        },
        {
            taskKey: 'dfPrimalFire',
            taskName: 'Primal Storm: Fire',
        },
        {
            taskKey: 'dfPrimalWater',
            taskName: 'Primal Storm: Water',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfSiegeDragonbaneKeep',
            taskName: 'Siege on Dragonbane Keep',
        },
        {
            taskKey: 'dfStormsFury',
            taskName: "Storm's Fury",
        },
        {
            minimumLevel: 60,
            taskKey: 'dfTrialElements',
            taskName: 'Trial of Elements',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfTrialFlood',
            taskName: 'Trial of the Flood',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfReachStormsChest',
            taskName: '[FR] Chest of Storms',
        },
    ],
    dfChores10_1_0: [
        {
            taskKey: 'dfDreamsurge',
            taskName: 'Dreamsurge',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfFyrakkAssault',
            taskName: 'Fyrakk - Assault',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfFyrakkDisciple',
            taskName: 'Fyrakk - Disciple',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfFyrakkShipment',
            taskName: 'Fyrakk - Secured Shipment',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfResearchersUnderFire1',
            taskName: 'Researchers Under Fire :quality-1-T1:',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfResearchersUnderFire2',
            taskName: 'Researchers Under Fire :quality-2-T2:',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfResearchersUnderFire3',
            taskName: 'Researchers Under Fire :quality-3-T3:',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfResearchersUnderFire4',
            taskName: 'Researchers Under Fire :quality-4-T4:',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfSniffenDig1',
            taskName: 'Sniffenseeking - Dig 1',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfSniffenDig2',
            taskName: 'Sniffenseeking - Dig 2',
        },
        {
            minimumLevel: 70,
            taskKey: 'dfSniffenDig3',
            taskName: 'Sniffenseeking - Dig 3',
        },
    ],
    dfChores10_2_0: [
        {
            taskKey: 'dfWorthyAllyDreamWardens',
            taskName: 'A Worthy Ally: Dream Wardens',
        },
        {
            taskKey: 'dfBloomingDreamseeds',
            taskName: 'Blooming Dreamseeds',
        },
        {
            taskKey: 'dfGoodsShipments1',
            taskName: 'Shipments x1',
        },
        {
            taskKey: 'dfGoodsShipments5',
            taskName: 'Shipments x5',
        },
        {
            taskKey: 'dfSuperbloom',
            taskName: 'Superbloom',
        },
        {
            taskKey: 'dfBigDig',
            taskName: 'The Big Dig',
        },
    ],
    dfDungeonWeeklies: [
        {
            taskKey: 'dfDungeonPreserving',
            taskName: 'Preserving the Past',
        },
        {
            taskKey: 'dfDungeonRelic',
            taskName: 'Relic Recovery',
        },
    ],
    dfProfessionWeeklies: [
        {
            taskKey: 'dfProfessionMettle',
            taskName: 'Show Your Mettle',
            minimumLevel: 60,
            couldGetFunc: (char) =>
                Array.from(wowthingData.static.professionById.values())
                    .filter((prof) => prof.type === 0)
                    .some(
                        (profession) =>
                            !!char.professions?.[profession.id]?.[
                                profession.expansionSubProfession[9].id
                            ]
                    ),
            canGetFunc: (char) =>
                char.reputations?.[2544] >= 500 ? '' : "Need Preferred with Artisan's Consortium",
        },
        ...dragonflightProfessionTasks,
    ],
    twwChores11_0,
    twwChores11_1,
    twwChores11_1_5,
    twwChoresChett,
    twwHorrificVisions,
    twwDelveKeys: [
        {
            taskKey: 'twwDelveArchaic',
            taskName: 'Archaic Cipher',
            minimumLevel: 70,
            noProgress: true,
            accountWide: true,
            questIds: [84370],
            questReset: DbResetType.Weekly,
        },
        {
            taskKey: 'twwDelveRepCouncil',
            taskName: 'Rep: Council of Dornogal',
            minimumLevel: 80,
            noProgress: true,
            accountWide: true,
            questIds: [83317],
            questReset: DbResetType.Weekly,
        },
        {
            taskKey: 'twwDelveRepAssembly',
            taskName: 'Rep: Assembly of the Deeps',
            minimumLevel: 80,
            noProgress: true,
            accountWide: true,
            questIds: [83318],
            questReset: DbResetType.Weekly,
        },
        {
            taskKey: 'twwDelveRepSevered',
            taskName: 'Rep: Severed Threads',
            minimumLevel: 80,
            noProgress: true,
            accountWide: true,
            questIds: [83319],
            questReset: DbResetType.Weekly,
        },
        {
            taskKey: 'twwDelveRepHallowfall',
            taskName: 'Rep: Hallowfall Arathi',
            minimumLevel: 80,
            noProgress: true,
            accountWide: true,
            questIds: [83320],
            questReset: DbResetType.Weekly,
        },
        {
            taskKey: 'twwDelveRepCartels',
            taskName: 'Rep: Cartels of Undermine',
            minimumLevel: 80,
            noProgress: true,
            accountWide: true,
            questIds: [87407],
            questReset: DbResetType.Weekly,
        },
        null,
        {
            taskKey: 'twwDelveKey1',
            taskName: 'Key #1',
            minimumLevel: 80,
            noProgress: true,
        },
        {
            taskKey: 'twwDelveKey2',
            taskName: 'Key #2',
            minimumLevel: 80,
            noProgress: true,
        },
        {
            taskKey: 'twwDelveKey3',
            taskName: 'Key #3',
            minimumLevel: 80,
            noProgress: true,
        },
        {
            taskKey: 'twwDelveKey4',
            taskName: 'Key #4',
            minimumLevel: 80,
            noProgress: true,
        },
        {
            taskKey: 'twwDelveGilded',
            taskName: 'Gilded Stash',
            minimumLevel: 80,
            showQuestName: true,
        },
        {
            taskKey: 'twwDelveMap',
            taskName: 'Map Drop',
            minimumLevel: 80,
            noProgress: true,
            questIds: [86371],
            questReset: DbResetType.Weekly,
        },
        {
            taskKey: 'twwDelveUnderpin',
            taskName: 'Underpin Invasion',
            minimumLevel: 80,
            noProgress: true,
            questIds: [87286, 87287],
            questReset: DbResetType.Weekly,
        },
    ],
    twwSpreading: [
        {
            taskKey: 'twwSpreadingTheLight',
            taskName: 'Spreading the Light',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingBleak',
            taskName: 'Bleak Sand',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingDuskrise',
            taskName: 'Duskrise Acreage',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingFaded',
            taskName: 'Faded Shore',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingFungal',
            taskName: 'Fungal Field',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingLights',
            taskName: "Light's Blooming",
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingStillstone',
            taskName: 'Stillstone Pond',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingTorchlight',
            taskName: 'Torchlight Mine',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingWhirring',
            taskName: 'Whirring Field',
            noProgress: true,
        },
        {
            taskKey: 'twwSpreadingAttica',
            taskName: 'Attica Whiskervale',
            subChores: [
                {
                    taskKey: 'twwSpreadingAtticaFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingAtticaQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
        {
            taskKey: 'twwSpreadingAuebry',
            taskName: 'Auebry Irongear',
            subChores: [
                {
                    taskKey: 'twwSpreadingAuebryFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingAuebryQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
        {
            taskKey: 'twwSpreadingChef',
            taskName: 'Chef Dinaire',
            subChores: [
                {
                    taskKey: 'twwSpreadingChefFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingChefQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
        {
            taskKey: 'twwSpreadingCrab',
            taskName: 'Crab Cage',
            subChores: [
                {
                    taskKey: 'twwSpreadingCrabFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingCrabQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
        {
            taskKey: 'twwSpreadingErol',
            taskName: 'Erol Ellimoore',
            subChores: [
                {
                    taskKey: 'twwSpreadingErolFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingErolQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
        {
            taskKey: 'twwSpreadingSeraphine',
            taskName: 'Seraphine Seedheart',
            subChores: [
                {
                    taskKey: 'twwSpreadingSeraphineFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingSeraphineQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
        {
            taskKey: 'twwSpreadingTaerry',
            taskName: 'Taerry Bligestone',
            subChores: [
                {
                    taskKey: 'twwSpreadingTaerryFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingTaerryQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
        {
            taskKey: 'twwSpreadingYorvas',
            taskName: 'Yorvas Flintstrike',
            subChores: [
                {
                    taskKey: 'twwSpreadingYorvasFlame',
                    taskName: nameFire,
                },
                {
                    taskKey: 'twwSpreadingYorvasQuest',
                    taskName: nameQuest,
                    showQuestName: true,
                },
            ],
        },
    ],
    twwProfessionWeeklies: [...warWithinProfessionTasks],
    pvpBrawl: [
        {
            taskKey: 'brawlFirstWin',
            taskName: '[D] First Win',
            noAlone: true,
            noProgress: true,
            questIds: [47144],
            questReset: DbResetType.Daily,
        },
        {
            taskKey: 'brawlArathiBlizzard',
            taskName: '[W] Arathi Blizzard',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlArathiBlizzard],
        },
        {
            taskKey: 'brawlClassicAshran',
            taskName: '[W] Classic Ashran',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlClassicAshran],
        },
        {
            taskKey: 'brawlCompStomp',
            taskName: '[W] Comp Stomp',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlCompStomp],
        },
        {
            taskKey: 'brawlCookingImpossible',
            taskName: '[W] Cooking Impossible',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlCookingImpossible],
        },
        {
            taskKey: 'brawlDeepSix',
            taskName: '[W] Deep Six',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlDeepSix],
        },
        {
            taskKey: 'brawlDeepwindDunk',
            taskName: '[W] Deepwind Dunk',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlDeepwindDunk],
        },
        {
            taskKey: 'brawlGravityLapse',
            taskName: '[W] Gravity Lapse',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlGravityLapse],
        },
        {
            taskKey: 'brawlPackedHouse',
            taskName: '[W] Packed House',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlPackedHouse],
        },
        {
            taskKey: 'brawlShadoPanShowdown',
            taskName: '[W] Shado-Pan Showdown',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlShadoPanShowdown],
        },
        {
            taskKey: 'brawlSouthshoreVsTarrenMill',
            taskName: '[W] Southshore vs. Tarren Mill',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlSouthshoreVsTarrenMill],
        },
        {
            taskKey: 'brawlTempleOfHotmogu',
            taskName: '[W] Temple of Hotmogu',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlTempleOfHotmogu],
        },
        {
            taskKey: 'brawlWarsongScramble',
            taskName: '[W] Warsong Scramble',
            questIds: somethingDifferent,
            questReset: DbResetType.Weekly,
            requiredHolidays: [Holiday.BrawlWarsongScramble],
        },
    ],
    pvpBlitz: [
        {
            taskKey: 'pvpBlitz1',
            taskName: 'Gotta Go Fast',
        },
        {
            taskKey: 'pvpBlitz3',
            taskName: 'Gotta Go Faster',
        },
    ],
};

export const taskChoreMap = Object.fromEntries(
    Object.entries(multiTaskMap).flatMap(([taskKey, chores]) =>
        chores.filter((chore) => !!chore).map((chore) => [`${taskKey}_${chore.taskKey}`, chore])
    )
);

export const questResetMap = Object.fromEntries(
    Object.values(taskChoreMap)
        .filter((chore) => chore.questIds && chore.questReset !== undefined)
        .flatMap((chore) => chore.questIds.map((questId) => [questId, chore.questReset]))
);

function couldGet(char: Character, professionId: number, subProfessionId: number): boolean {
    const profession = wowthingData.static.professionById.get(professionId);
    return !!char.professions?.[profession.id]?.[subProfessionId];
}

function getExpansionSkill(
    char: Character,
    professionId: number,
    expansion: number,
    minSkill: number
): string {
    const currentSubProfession =
        wowthingData.static.professionById.get(professionId).expansionSubProfession[expansion];
    const skill = char.professions[professionId][currentSubProfession?.id]?.currentSkill ?? 0;

    return skill < minSkill ? `Need ${minSkill} skill` : '';
}
