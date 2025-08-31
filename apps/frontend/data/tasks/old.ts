import { Constants } from '@/data/constants';
import {
    dragonflightProfessions,
    isGatheringProfession,
    warWithinProfessions,
} from '@/data/professions';
import { Holiday } from '@/enums/holiday';
import { Profession } from '@/enums/profession';
import { wowthingData } from '@/shared/stores/data';
import { DbResetType } from '@/shared/stores/db/enums';
import { userState } from '@/user-home/state/user';
import type { Character } from '@/types';
import type { TaskProfession } from '@/types/data';
import type { Chore, Task } from '@/types/tasks';

import { eventGreedyEmissaryChores, eventGreedyEmissaryTask, eventsTurboBoost } from './events';
import {
    actualHolidayChores,
    actualHolidayTasks,
    holidayTimewalkingChores,
    weeklyHolidayTasks,
} from './holidays';
import { shadowlandsTasks } from './shadowlands';
import {
    twwChores11_0,
    twwChores11_1,
    twwChores11_1_5,
    twwChores11_2_0,
    twwChoresChett,
    twwCofferKeys,
    twwHorrificVisions,
    twwPinnacle,
} from './the_war_within';

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
                key: `${prefix}Profession${name}Provide`,
                name: `${name}: Provide`,
                minimumLevel,
                couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
                canGetFunc: (char) =>
                    getExpansionSkill(char, profession.id, Constants.expansion, 45),
            });
        }

        if (profession.hasTasks === true) {
            tasks.push({
                key: `${prefix}Profession${name}Task`,
                name: `${name}: Task`,
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
            key: `${prefix}Profession${name}Drop#`,
            name: `${name}: Drops`,
            minimumLevel,
            couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
            //canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
        });

        if (profession.hasOrders === true) {
            tasks.push({
                key: `${prefix}Profession${name}Orders`,
                name: `${name}: Orders`,
                minimumLevel,
                couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
                canGetFunc: (char) =>
                    getExpansionSkill(char, profession.id, expansion, expansion === 9 ? 25 : 1),
            });
        }

        tasks.push({
            key: `${prefix}Profession${name}Treatise`,
            name: `${name}: Treatise`,
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
    eventGreedyEmissaryTask,
    {
        key: 'turboBoost',
        minimumLevel: 80,
        name: '[Event] Turbo Boost',
        shortName: 'Turbo',
        type: 'multi',
    },

    ...actualHolidayTasks,
    ...weeklyHolidayTasks,

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

    ...shadowlandsTasks,

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
    // {
    //     key: 'twwChores11_0',
    //     name: '[TWW] 11.0.x',
    //     shortName: '11.0',
    //     minimumLevel: 70,
    //     showSeparate: true,
    //     type: 'multi',
    // },
    // {
    //     key: 'twwChores11_1',
    //     name: '[TWW] 11.1.x',
    //     shortName: '11.1',
    //     minimumLevel: 80,
    //     showSeparate: true,
    //     type: 'multi',
    // },
    // {
    //     key: 'twwChoresChett',
    //     name: '[TWW] C.H.E.T.T. List',
    //     shortName: 'CHETT',
    //     minimumLevel: 80,
    //     type: 'multi',
    // },
    // {
    //     key: 'twwChores11_1_5',
    //     name: "[TWW] 11.1.5 Flame's Radiance",
    //     shortName: 'Rad',
    //     minimumLevel: 10,
    //     showSeparate: true,
    //     type: 'multi',
    // },
    // {
    //     key: 'twwChores11_2_0',
    //     name: '[TWW] 11.2.x',
    //     shortName: '11.2',
    //     minimumLevel: 80,
    //     showSeparate: true,
    //     type: 'multi',
    // },
    // {
    //     key: 'twwHorrificVisions',
    //     name: '[TWW] Horrific Visions Revisited',
    //     shortName: 'Vis',
    //     minimumLevel: 80,
    //     type: 'multi',
    // },
    {
        key: 'twwCofferKeys',
        name: '[TWW] Coffer Keys',
        shortName: 'Keys',
        minimumLevel: 80,
        type: 'multi',
    },
    {
        key: 'twwDelveKeys',
        name: '[TWW] Delves',
        shortName: 'Delve',
        minimumLevel: 80,
        showSeparate: true,
        type: 'multi',
    },
    {
        key: 'twwPinnacle',
        name: '[TWW] Veteran Caches',
        shortName: 'Vet',
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
        minimumLevel: 70,
    },

    // Misc
];

export const taskMap: Record<string, Task> = Object.fromEntries(
    taskList.map((task) => [task.key, task])
);

function garrisonCouldGet(char: Character): boolean {
    return [36592, 36567].some((questId) =>
        userState.quests.characterById.get(char.id).hasQuestById.has(questId)
    );
}

// export const multiTaskMap: Record<string, Chore[]> = {
//     greedyEmissary: eventGreedyEmissaryChores,
//     turboBoost: eventsTurboBoost,
//     ...actualHolidayChores,
//     ...holidayTimewalkingChores,
//     wodGarrison: [
//         {
//             key: 'invasionBronze',
//             name: '{item:120320}', // Invader's Abandoned Sack
//             couldGetFunc: garrisonCouldGet,
//             minimumLevel: 10,
//         },
//         {
//             key: 'invasionSilver',
//             name: '{item:120319}', // Invader's Damaged Cache
//             couldGetFunc: garrisonCouldGet,
//             minimumLevel: 10,
//         },
//         {
//             key: 'invasionGold',
//             name: '{item:116980}', // Invader's Forgotten Treasure
//             couldGetFunc: garrisonCouldGet,
//             minimumLevel: 10,
//         },
//         {
//             key: 'invasionPlatinum',
//             name: '{item:122163}', // Routed Invader's Crate of Spoils
//             couldGetFunc: garrisonCouldGet,
//             minimumLevel: 10,
//         },
//     ],
//     dfCatchRelease: [
//         {
//             key: 'dfCatchAileron',
//             name: 'Aileron Seamoth',
//         },
//         {
//             key: 'dfCatchCerulean',
//             name: 'Cerulean Spinefish',
//         },
//         {
//             key: 'dfCatchIslefin',
//             name: 'Islefin Dorado',
//         },
//         {
//             key: 'dfCatchScalebelly',
//             name: 'Scalebelly Mackerel',
//         },
//         {
//             key: 'dfCatchTemporal',
//             name: 'Temporal Dragonhead',
//         },
//         {
//             key: 'dfCatchThousandbite',
//             name: 'Thousandbite Piranha',
//         },
//     ],
//     dfChores: [
//         {
//             minimumLevel: 60,
//             key: 'dfCommunityFeast',
//             name: 'Community Feast',
//         },
//         // { // actually daily
//         //     taskKey: 'dfCommunityFeastKill',
//         //     taskName: 'Community Feast: Boss',
//         // },
//         {
//             key: 'dfDragonAllegiance',
//             name: 'Dragon selected',
//         },
//         {
//             key: 'dfDragonKey',
//             name: 'Dragon key turned in',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfGrandHuntMythic',
//             name: 'Grand Hunt: Epic',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfGrandHuntRare',
//             name: 'Grand Hunt: Rare',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfGrandHuntUncommon',
//             name: 'Grand Hunt: Uncommon',
//         },
//         {
//             key: 'dfPrimalStorm',
//             name: 'Primal Storm: Air',
//         },
//         {
//             key: 'dfPrimalEarth',
//             name: 'Primal Storm: Earth',
//         },
//         {
//             key: 'dfPrimalFire',
//             name: 'Primal Storm: Fire',
//         },
//         {
//             key: 'dfPrimalWater',
//             name: 'Primal Storm: Water',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfSiegeDragonbaneKeep',
//             name: 'Siege on Dragonbane Keep',
//         },
//         {
//             key: 'dfStormsFury',
//             name: "Storm's Fury",
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfTrialElements',
//             name: 'Trial of Elements',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfTrialFlood',
//             name: 'Trial of the Flood',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfReachStormsChest',
//             name: '[FR] Chest of Storms',
//         },
//     ],
//     dfChores10_1_0: [
//         {
//             key: 'dfDreamsurge',
//             name: 'Dreamsurge',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfFyrakkAssault',
//             name: 'Fyrakk - Assault',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfFyrakkDisciple',
//             name: 'Fyrakk - Disciple',
//         },
//         {
//             minimumLevel: 60,
//             key: 'dfFyrakkShipment',
//             name: 'Fyrakk - Secured Shipment',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfResearchersUnderFire1',
//             name: 'Researchers Under Fire :quality-1-T1:',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfResearchersUnderFire2',
//             name: 'Researchers Under Fire :quality-2-T2:',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfResearchersUnderFire3',
//             name: 'Researchers Under Fire :quality-3-T3:',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfResearchersUnderFire4',
//             name: 'Researchers Under Fire :quality-4-T4:',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfSniffenDig1',
//             name: 'Sniffenseeking - Dig 1',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfSniffenDig2',
//             name: 'Sniffenseeking - Dig 2',
//         },
//         {
//             minimumLevel: 70,
//             key: 'dfSniffenDig3',
//             name: 'Sniffenseeking - Dig 3',
//         },
//     ],
//     dfChores10_2_0: [
//         {
//             key: 'dfWorthyAllyDreamWardens',
//             name: 'A Worthy Ally: Dream Wardens',
//         },
//         {
//             key: 'dfBloomingDreamseeds',
//             name: 'Blooming Dreamseeds',
//         },
//         {
//             key: 'dfGoodsShipments1',
//             name: 'Shipments x1',
//         },
//         {
//             key: 'dfGoodsShipments5',
//             name: 'Shipments x5',
//         },
//         {
//             key: 'dfSuperbloom',
//             name: 'Superbloom',
//         },
//         {
//             key: 'dfBigDig',
//             name: 'The Big Dig',
//         },
//     ],
//     dfDungeonWeeklies: [
//         {
//             key: 'dfDungeonPreserving',
//             name: 'Preserving the Past',
//         },
//         {
//             key: 'dfDungeonRelic',
//             name: 'Relic Recovery',
//         },
//     ],
//     dfProfessionWeeklies: [
//         {
//             key: 'dfProfessionMettle',
//             name: 'Show Your Mettle',
//             minimumLevel: 60,
//             couldGetFunc: (char) =>
//                 Array.from(wowthingData.static.professionById.values())
//                     .filter((prof) => prof.type === 0)
//                     .some(
//                         (profession) =>
//                             !!char.professions?.[profession.id]?.subProfessions?.[
//                                 profession.expansionSubProfession[9].id
//                             ]
//                     ),
//             canGetFunc: (char) =>
//                 char.reputations?.[2544] >= 500 ? '' : "Need Preferred with Artisan's Consortium",
//         },
//         ...dragonflightProfessionTasks,
//     ],
//     twwChores11_0,
//     twwChores11_1,
//     twwChores11_1_5,
//     twwChores11_2_0,
//     twwChoresChett,
//     twwCofferKeys,
//     twwHorrificVisions,
//     twwPinnacle,
//     twwDelveKeys: [
//         {
//             key: 'twwDelveArchaic',
//             name: 'Archaic Cipher',
//             minimumLevel: 70,
//             noProgress: true,
//             accountWide: true,
//             questIds: [84370],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveRepCouncil',
//             name: 'Rep: Council of Dornogal',
//             minimumLevel: 80,
//             noProgress: true,
//             accountWide: true,
//             questIds: [83317],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveRepAssembly',
//             name: 'Rep: Assembly of the Deeps',
//             minimumLevel: 80,
//             noProgress: true,
//             accountWide: true,
//             questIds: [83318],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveRepSevered',
//             name: 'Rep: Severed Threads',
//             minimumLevel: 80,
//             noProgress: true,
//             accountWide: true,
//             questIds: [83319],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveRepHallowfall',
//             name: 'Rep: Hallowfall Arathi',
//             minimumLevel: 80,
//             noProgress: true,
//             accountWide: true,
//             questIds: [83320],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveRepCartels',
//             name: 'Rep: Cartels of Undermine',
//             minimumLevel: 80,
//             noProgress: true,
//             accountWide: true,
//             questIds: [87407],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveRepKaresh',
//             name: "Rep: The K'aresh Trust",
//             minimumLevel: 80,
//             noProgress: true,
//             accountWide: true,
//             questIds: [91453],
//             questReset: DbResetType.Weekly,
//         },
//         null,
//         {
//             key: 'twwDelveKey1',
//             name: 'Key #1',
//             minimumLevel: 80,
//             noProgress: true,
//             questIds: [91175],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveKey2',
//             name: 'Key #2',
//             minimumLevel: 80,
//             noProgress: true,
//             questIds: [91176],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveKey3',
//             name: 'Key #3',
//             minimumLevel: 80,
//             noProgress: true,
//             questIds: [91177],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveKey4',
//             name: 'Key #4',
//             minimumLevel: 80,
//             noProgress: true,
//             questIds: [91178],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveGilded',
//             name: 'Gilded Stash',
//             minimumLevel: 80,
//             showQuestName: true,
//         },
//         {
//             key: 'twwDelveMap',
//             name: 'Map Drop',
//             minimumLevel: 80,
//             noProgress: true,
//             questIds: [86371],
//             questReset: DbResetType.Weekly,
//         },
//         {
//             key: 'twwDelveUnderpin',
//             name: 'Underpin Invasion',
//             minimumLevel: 80,
//             noProgress: true,
//             questIds: [87286, 87287],
//             questReset: DbResetType.Weekly,
//         },
//     ],
//     twwSpreading: [
//         {
//             key: 'twwSpreadingTheLight',
//             name: 'Spreading the Light',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingBleak',
//             name: 'Bleak Sand',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingDuskrise',
//             name: 'Duskrise Acreage',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingFaded',
//             name: 'Faded Shore',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingFungal',
//             name: 'Fungal Field',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingLights',
//             name: "Light's Blooming",
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingStillstone',
//             name: 'Stillstone Pond',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingTorchlight',
//             name: 'Torchlight Mine',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingWhirring',
//             name: 'Whirring Field',
//             noProgress: true,
//         },
//         {
//             key: 'twwSpreadingAttica',
//             name: 'Attica Whiskervale',
//             subChores: [
//                 {
//                     key: 'twwSpreadingAtticaFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingAtticaQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//         {
//             key: 'twwSpreadingAuebry',
//             name: 'Auebry Irongear',
//             subChores: [
//                 {
//                     key: 'twwSpreadingAuebryFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingAuebryQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//         {
//             key: 'twwSpreadingChef',
//             name: 'Chef Dinaire',
//             subChores: [
//                 {
//                     key: 'twwSpreadingChefFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingChefQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//         {
//             key: 'twwSpreadingCrab',
//             name: 'Crab Cage',
//             subChores: [
//                 {
//                     key: 'twwSpreadingCrabFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingCrabQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//         {
//             key: 'twwSpreadingErol',
//             name: 'Erol Ellimoore',
//             subChores: [
//                 {
//                     key: 'twwSpreadingErolFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingErolQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//         {
//             key: 'twwSpreadingSeraphine',
//             name: 'Seraphine Seedheart',
//             subChores: [
//                 {
//                     key: 'twwSpreadingSeraphineFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingSeraphineQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//         {
//             key: 'twwSpreadingTaerry',
//             name: 'Taerry Bligestone',
//             subChores: [
//                 {
//                     key: 'twwSpreadingTaerryFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingTaerryQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//         {
//             key: 'twwSpreadingYorvas',
//             name: 'Yorvas Flintstrike',
//             subChores: [
//                 {
//                     key: 'twwSpreadingYorvasFlame',
//                     name: nameFire,
//                 },
//                 {
//                     key: 'twwSpreadingYorvasQuest',
//                     name: nameQuest,
//                     showQuestName: true,
//                 },
//             ],
//         },
//     ],
//     twwProfessionWeeklies: [...warWithinProfessionTasks],
//     pvpBrawl: [
//         {
//             key: 'brawlFirstWin',
//             name: '[D] First Win',
//             noAlone: true,
//             noProgress: true,
//             questIds: [47144],
//             questReset: DbResetType.Daily,
//         },
//         {
//             key: 'brawlArathiBlizzard',
//             name: '[W] Arathi Blizzard',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlArathiBlizzard],
//         },
//         {
//             key: 'brawlClassicAshran',
//             name: '[W] Classic Ashran',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlClassicAshran],
//         },
//         {
//             key: 'brawlCompStomp',
//             name: '[W] Comp Stomp',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlCompStomp],
//         },
//         {
//             key: 'brawlCookingImpossible',
//             name: '[W] Cooking Impossible',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlCookingImpossible],
//         },
//         {
//             key: 'brawlDeepSix',
//             name: '[W] Deep Six',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlDeepSix],
//         },
//         {
//             key: 'brawlDeepwindDunk',
//             name: '[W] Deepwind Dunk',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlDeepwindDunk],
//         },
//         {
//             key: 'brawlGravityLapse',
//             name: '[W] Gravity Lapse',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlGravityLapse],
//         },
//         {
//             key: 'brawlPackedHouse',
//             name: '[W] Packed House',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlPackedHouse],
//         },
//         {
//             key: 'brawlShadoPanShowdown',
//             name: '[W] Shado-Pan Showdown',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlShadoPanShowdown],
//         },
//         {
//             key: 'brawlSouthshoreVsTarrenMill',
//             name: '[W] Southshore vs. Tarren Mill',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlSouthshoreVsTarrenMill],
//         },
//         {
//             key: 'brawlTempleOfHotmogu',
//             name: '[W] Temple of Hotmogu',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlTempleOfHotmogu],
//         },
//         {
//             key: 'brawlWarsongScramble',
//             name: '[W] Warsong Scramble',
//             questIds: somethingDifferent,
//             questReset: DbResetType.Weekly,
//             requiredHolidays: [Holiday.BrawlWarsongScramble],
//         },
//     ],
//     pvpBlitz: [
//         {
//             key: 'pvpBlitz1',
//             name: 'Gotta Go Fast',
//         },
//         {
//             key: 'pvpBlitz3',
//             name: 'Gotta Go Faster',
//         },
//     ],
// };

export const taskChoreMap = Object.fromEntries(
    Object.entries(multiTaskMap).flatMap(([taskKey, chores]) =>
        chores.filter((chore) => !!chore).map((chore) => [`${taskKey}_${chore.key}`, chore])
    )
);

export const questResetMap = Object.fromEntries(
    Object.values(taskChoreMap)
        .filter((chore) => chore.questIds && chore.questReset !== undefined)
        .flatMap((chore) => chore.questIds.map((questId) => [questId, chore.questReset]))
);

function couldGet(char: Character, professionId: number, subProfessionId: number): boolean {
    const profession = wowthingData.static.professionById.get(professionId);
    return !!char.professions?.[profession.id]?.subProfessions?.[subProfessionId];
}

function getExpansionSkill(
    char: Character,
    professionId: number,
    expansion: number,
    minSkill: number
): string {
    const currentSubProfession =
        wowthingData.static.professionById.get(professionId).expansionSubProfession[expansion];
    const skill =
        char.professions[professionId].subProfessions[currentSubProfession?.id]?.skillCurrent ?? 0;

    return skill < minSkill ? `Need ${minSkill} skill` : '';
}
