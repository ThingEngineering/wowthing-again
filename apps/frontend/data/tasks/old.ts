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
    twwChoresChett,
    twwHorrificVisions,
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
        showSeparate: true,
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
    return [36592, 36567].some((questId) =>
        userState.quests.characterById.get(char.id).hasQuestById.has(questId)
    );
}

export const multiTaskMap: Record<string, Chore[]> = {
    greedyEmissary: eventGreedyEmissaryChores,
    turboBoost: eventsTurboBoost,
    ...actualHolidayChores,
    ...holidayTimewalkingChores,
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
                            !!char.professions?.[profession.id]?.subProfessions?.[
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
