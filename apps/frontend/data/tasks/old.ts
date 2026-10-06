// import { Constants } from '@/data/constants';
// import {
//     dragonflightProfessions,
//     isGatheringProfession,
//     warWithinProfessions,
// } from '@/data/professions';
// import { Holiday } from '@/enums/holiday';
// import { Profession } from '@/enums/profession';
// import { wowthingData } from '@/shared/stores/data';
// import { DbResetType } from '@/shared/stores/db/enums';
// import { userState } from '@/user-home/state/user';
// import type { Character } from '@/types';
// import type { TaskProfession } from '@/types/data';
// import type { Chore, Task } from '@/types/tasks';

// import { eventGreedyEmissaryChores, eventGreedyEmissaryTask, eventsTurboBoost } from './events';
// import {
//     actualHolidayChores,
//     actualHolidayTasks,
//     holidayTimewalkingChores,
//     weeklyHolidayTasks,
// } from './holidays';
// import { shadowlandsTasks } from './shadowlands';
// import {
//     twwChores11_0,
//     twwChores11_1,
//     twwChores11_1_5,
//     twwChores11_2_0,
//     twwChoresChett,
//     twwCofferKeys,
//     twwHorrificVisions,
// } from './the_war_within';

// const nameFire = '<span class="status-warn">:fire:</span>';
// const nameQuest = '<span class="status-shrug">:exclamation:</span>';

// const somethingDifferent = [47148];

// export const taskList: Task[] = [
//     // Events/Holidays/idk
//     eventGreedyEmissaryTask,
//     {
//         key: 'turboBoost',
//         minimumLevel: 80,
//         name: '[Event] Turbo Boost',
//         shortName: 'Turbo',
//         type: 'multi',
//     },

//     ...actualHolidayTasks,
//     ...weeklyHolidayTasks,

//     // Legion
//     {
//         key: 'legionWitheredTraining',
//         name: '[Legion] Withered Army Training',
//         shortName: 'Wither',
//         minimumLevel: 45,
//         requiredQuestId: 44636, // Building an Army
//     },

//     ...shadowlandsTasks,

//     // Dragonflight
//     {
//         key: 'dfAidingAccord',
//         name: '[DF] Aiding the Accord',
//         shortName: 'AtA',
//         minimumLevel: 60,
//     },
//     {
//         key: 'dfWorthyAllyLoammNiffen',
//         name: '[DF] A Worthy Ally: Loamm Niffen',
//         shortName: 'WA:LN',
//         minimumLevel: 70,
//     },
//     {
//         key: 'dfCatchRelease',
//         name: '[DF] Catch and Release (Fishing)',
//         shortName: 'CaR',
//         type: 'multi',
//     },
//     {
//         key: 'dfChores',
//         name: '[DF] Chores - 10.0.x',
//         shortName: '10.0',
//         minimumLevel: 60,
//         type: 'multi',
//     },
//     {
//         key: 'dfChores10_1_0',
//         name: '[DF] Chores - 10.1.x',
//         shortName: '10.1',
//         minimumLevel: 60,
//         type: 'multi',
//     },
//     {
//         key: 'dfChores10_2_0',
//         name: '[DF] Chores - 10.2.x',
//         shortName: '10.2',
//         minimumLevel: 70,
//         type: 'multi',
//     },
//     {
//         key: 'dfSparks',
//         name: '[DF] Sparks of Life (PvP)',
//         shortName: 'DF🌟',
//         minimumLevel: 60,
//     },
//     {
//         key: 'dfTimeRift',
//         name: '[DF] Time Rifts',
//         shortName: 'TR',
//         minimumLevel: 60,
//     },

//     // The War Within
//     {
//         key: 'twwSpreading',
//         name: '[TWW] Spreading the Light',
//         shortName: 'StL',
//         minimumLevel: 70,
//         type: 'multi',
//     },
//     {
//         key: 'twwSparks',
//         name: '[TWW] Sparks of Life (PvP)',
//         shortName: 'WW🌟',
//         minimumLevel: 70,
//     },

// // export const multiTaskMap: Record<string, Chore[]> = {
// //     greedyEmissary: eventGreedyEmissaryChores,
// //     turboBoost: eventsTurboBoost,
// //     ...actualHolidayChores,
// //     ...holidayTimewalkingChores,
// //     dfCatchRelease: [
// //         {
// //             key: 'dfCatchAileron',
// //             name: 'Aileron Seamoth',
// //         },
// //         {
// //             key: 'dfCatchCerulean',
// //             name: 'Cerulean Spinefish',
// //         },
// //         {
// //             key: 'dfCatchIslefin',
// //             name: 'Islefin Dorado',
// //         },
// //         {
// //             key: 'dfCatchScalebelly',
// //             name: 'Scalebelly Mackerel',
// //         },
// //         {
// //             key: 'dfCatchTemporal',
// //             name: 'Temporal Dragonhead',
// //         },
// //         {
// //             key: 'dfCatchThousandbite',
// //             name: 'Thousandbite Piranha',
// //         },
// //     ],
// //     dfChores: [
// //         {
// //             minimumLevel: 60,
// //             key: 'dfCommunityFeast',
// //             name: 'Community Feast',
// //         },
// //         // { // actually daily
// //         //     taskKey: 'dfCommunityFeastKill',
// //         //     taskName: 'Community Feast: Boss',
// //         // },
// //         {
// //             key: 'dfDragonAllegiance',
// //             name: 'Dragon selected',
// //         },
// //         {
// //             key: 'dfDragonKey',
// //             name: 'Dragon key turned in',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfGrandHuntMythic',
// //             name: 'Grand Hunt: Epic',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfGrandHuntRare',
// //             name: 'Grand Hunt: Rare',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfGrandHuntUncommon',
// //             name: 'Grand Hunt: Uncommon',
// //         },
// //         {
// //             key: 'dfPrimalStorm',
// //             name: 'Primal Storm: Air',
// //         },
// //         {
// //             key: 'dfPrimalEarth',
// //             name: 'Primal Storm: Earth',
// //         },
// //         {
// //             key: 'dfPrimalFire',
// //             name: 'Primal Storm: Fire',
// //         },
// //         {
// //             key: 'dfPrimalWater',
// //             name: 'Primal Storm: Water',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfSiegeDragonbaneKeep',
// //             name: 'Siege on Dragonbane Keep',
// //         },
// //         {
// //             key: 'dfStormsFury',
// //             name: "Storm's Fury",
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfTrialElements',
// //             name: 'Trial of Elements',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfTrialFlood',
// //             name: 'Trial of the Flood',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfReachStormsChest',
// //             name: '[FR] Chest of Storms',
// //         },
// //     ],
// //     dfChores10_1_0: [
// //         {
// //             key: 'dfDreamsurge',
// //             name: 'Dreamsurge',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfFyrakkAssault',
// //             name: 'Fyrakk - Assault',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfFyrakkDisciple',
// //             name: 'Fyrakk - Disciple',
// //         },
// //         {
// //             minimumLevel: 60,
// //             key: 'dfFyrakkShipment',
// //             name: 'Fyrakk - Secured Shipment',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfResearchersUnderFire1',
// //             name: 'Researchers Under Fire :quality-1-T1:',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfResearchersUnderFire2',
// //             name: 'Researchers Under Fire :quality-2-T2:',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfResearchersUnderFire3',
// //             name: 'Researchers Under Fire :quality-3-T3:',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfResearchersUnderFire4',
// //             name: 'Researchers Under Fire :quality-4-T4:',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfSniffenDig1',
// //             name: 'Sniffenseeking - Dig 1',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfSniffenDig2',
// //             name: 'Sniffenseeking - Dig 2',
// //         },
// //         {
// //             minimumLevel: 70,
// //             key: 'dfSniffenDig3',
// //             name: 'Sniffenseeking - Dig 3',
// //         },
// //     ],
// //     dfChores10_2_0: [
// //         {
// //             key: 'dfWorthyAllyDreamWardens',
// //             name: 'A Worthy Ally: Dream Wardens',
// //         },
// //         {
// //             key: 'dfBloomingDreamseeds',
// //             name: 'Blooming Dreamseeds',
// //         },
// //         {
// //             key: 'dfGoodsShipments1',
// //             name: 'Shipments x1',
// //         },
// //         {
// //             key: 'dfGoodsShipments5',
// //             name: 'Shipments x5',
// //         },
// //         {
// //             key: 'dfSuperbloom',
// //             name: 'Superbloom',
// //         },
// //     ],
// //     dfDungeonWeeklies: [
// //         {
// //             key: 'dfDungeonPreserving',
// //             name: 'Preserving the Past',
// //         },
// //         {
// //             key: 'dfDungeonRelic',
// //             name: 'Relic Recovery',
// //         },
// //     ],
// //     dfProfessionWeeklies: [
// //         {
// //             key: 'dfProfessionMettle',
// //             name: 'Show Your Mettle',
// //             minimumLevel: 60,
// //             couldGetFunc: (char) =>
// //                 Array.from(wowthingData.static.professionById.values())
// //                     .filter((prof) => prof.type === 0)
// //                     .some(
// //                         (profession) =>
// //                             !!char.professions?.[profession.id]?.subProfessions?.[
// //                                 profession.expansionSubProfession[9].id
// //                             ]
// //                     ),
// //             canGetFunc: (char) =>
// //                 char.reputations?.[2544] >= 500 ? '' : "Need Preferred with Artisan's Consortium",
// //         },
// //         ...dragonflightProfessionTasks,
// //     ],
// //     twwSpreading: [
// //         {
// //             key: 'twwSpreadingTheLight',
// //             name: 'Spreading the Light',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingBleak',
// //             name: 'Bleak Sand',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingDuskrise',
// //             name: 'Duskrise Acreage',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingFaded',
// //             name: 'Faded Shore',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingFungal',
// //             name: 'Fungal Field',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingLights',
// //             name: "Light's Blooming",
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingStillstone',
// //             name: 'Stillstone Pond',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingTorchlight',
// //             name: 'Torchlight Mine',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingWhirring',
// //             name: 'Whirring Field',
// //             alwaysStarted: true,
// //         },
// //         {
// //             key: 'twwSpreadingAttica',
// //             name: 'Attica Whiskervale',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingAtticaFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingAtticaQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //         {
// //             key: 'twwSpreadingAuebry',
// //             name: 'Auebry Irongear',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingAuebryFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingAuebryQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //         {
// //             key: 'twwSpreadingChef',
// //             name: 'Chef Dinaire',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingChefFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingChefQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //         {
// //             key: 'twwSpreadingCrab',
// //             name: 'Crab Cage',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingCrabFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingCrabQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //         {
// //             key: 'twwSpreadingErol',
// //             name: 'Erol Ellimoore',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingErolFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingErolQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //         {
// //             key: 'twwSpreadingSeraphine',
// //             name: 'Seraphine Seedheart',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingSeraphineFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingSeraphineQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //         {
// //             key: 'twwSpreadingTaerry',
// //             name: 'Taerry Bligestone',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingTaerryFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingTaerryQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //         {
// //             key: 'twwSpreadingYorvas',
// //             name: 'Yorvas Flintstrike',
// //             subChores: [
// //                 {
// //                     key: 'twwSpreadingYorvasFlame',
// //                     name: nameFire,
// //                 },
// //                 {
// //                     key: 'twwSpreadingYorvasQuest',
// //                     name: nameQuest,
// //                     showQuestName: true,
// //                 },
// //             ],
// //         },
// //     ],
// //     pvpBlitz: [
// //         {
// //             key: 'pvpBlitz1',
// //             name: 'Gotta Go Fast',
// //         },
// //         {
// //             key: 'pvpBlitz3',
// //             name: 'Gotta Go Faster',
// //         },
// //     ],
// // };
