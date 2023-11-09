import flatten from 'lodash/flatten'
import some from 'lodash/some'
import { get } from 'svelte/store'

import { Constants } from './constants'
import { userQuestStore } from '@/stores'
import { staticStore } from '@/shared/stores/static'
import { Profession } from '@/enums/profession'
import type { Character } from '@/types'
import type { Chore, Task } from '@/types/tasks'
import { dragonflightProfessions, isGatheringProfession, professionSlugToId } from './professions'


export const dragonflightProfessionTasks: Chore[] = flatten(
    dragonflightProfessions.map((profession) => {
        const name = Profession[profession.id]
        const lowerName = Profession[profession.id].toLowerCase()
        const tasks: Chore[] = []

        tasks.push(
            {
                taskKey: `dfProfession${name}Provide`,
                taskName: `${name}: Provide`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
                canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
            },
        )

        if (profession.hasTask === true) {
            tasks.push(
                {
                    taskKey: `dfProfession${name}Task`,
                    taskName: `${name}: Task`,
                    minimumLevel: 60,
                    couldGetFunc: (char) => couldGet(lowerName, char),
                    canGetFunc: (char) => getLatestSkill(char, lowerName,
                        isGatheringProfession[profession.id] ? 45 : 25),
                },
            )
        }

        tasks.push(
            {
                taskKey: `dfProfession${name}Drop#`,
                taskName: `${name}: Drops`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
                //canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
            },
        )

        if (profession.hasOrders === true) {
            tasks.push(
                {
                    taskKey: `dfProfession${name}Orders`,
                    taskName: `${name}: Orders`,
                    minimumLevel: 60,
                    couldGetFunc: (char) => couldGet(lowerName, char),
                    canGetFunc: (char) => getLatestSkill(char, lowerName, 25),
                },
            )
        }

        tasks.push(
            {
                taskKey: `dfProfession${name}Treatise`,
                taskName: `${name}: Treatise`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
            },
        )

        return tasks
    })
)

export const taskList: Task[] = [
    // Misc
    {
        key: 'dmfProfessions',
        name: '[DMF] Professions',
        shortName: 'DMF',
    },

    // Holidays
    {
        key: 'holidayArena',
        name: '[Holiday] Arena',
        shortName: 'Arena',
    },
    {
        key: 'holidayBattlegrounds',
        name: '[Holiday] Battlegrounds',
        shortName: 'BGs',
    },
    {
        key: 'holidayDungeons',
        name: '[Holiday] Mythic Dungeons',
        shortName: 'MDun',
    },
    {
        key: 'holidayPetPvp',
        name: '[Holiday] Pet PvP',
        shortName: 'Pets',
    },
    {
        key: 'holidayTimewalking',
        name: '[Holiday] Timewalking Dungeons',
        shortName: 'TW :exclamation:',
    },
    {
        key: 'holidayTimewalkingItem',
        name: '[Holiday] Timewalking Item',
        shortName: 'TW :item:',
        minimumLevel: Constants.characterMaxLevel - 10,
    },
    {
        key: 'holidayWorldQuests',
        name: '[Holiday] World Quests',
        shortName: 'WQs',
    },

    // PvP
    {
        key: 'pvpBattlegrounds',
        name: '[PvP] Battlegrounds',
        shortName: 'BGs',
    },
    {
        key: 'pvpWar',
        name: '[PvP] Epic Battlegrounds',
        shortName: 'EBGs',
    },
    {
        key: 'pvpTeamwork',
        name: '[PvP] Rated Battlegrounds',
        shortName: 'RBGs',
    },
    {
        key: 'pvpBrawl',
        name: '[PvP] Brawl (Something Different)',
        shortName: 'Brawl',
    },
    {
        key: 'pvpArenas',
        name: '[PvP] Arenas',
        shortName: 'Arena',
    },
    {
        key: 'pvpSolo',
        name: '[PvP] Solo Shuffle',
        shortName: 'Solo',
    },
    {
        key: 'pvpOverwhelmingOdds',
        name: '[PvP] Overwhelming Odds',
        shortName: 'WM',
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
        key: 'dfWorthyAllyDreamWardens',
        name: '[DF] A Worthy Ally: Dream Wardens',
        shortName: 'WA:DW',
        minimumLevel: 70,
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
        name: '[DF] Chores',
        shortName: 'Cho',
        minimumLevel: 60,
        type: 'multi',
    },
    {
        key: 'dfChores10_1_0',
        name: '[DF] Chores - 10.1.0',
        shortName: '10.1',
        minimumLevel: 60,
        type: 'multi',
    },
    {
        key: 'dfDreamsurge',
        name: '[DF] Dreamsurge',
        shortName: 'DS',
    },
    {
        key: 'dfFighting',
        name: '[DF] Heroic Dungeons',
        shortName: 'HDun',
    },
    {
        key: 'dfProfessionWeeklies',
        name: '[DF] Profession Weeklies',
        shortName: 'Pro',
        type: 'multi',
        minimumLevel: 60,
    },
    {
        key: 'dfSparks',
        name: '[DF] Sparks of Life (PvP)',
        shortName: 'SoL',
        minimumLevel: 60,
    },
    {
        key: 'dfSuperbloom',
        name: '[DF] Superbloom',
        shortName: 'SB',
    },
    {
        key: 'dfTimeRift',
        name: '[DF] Time Rifts',
        shortName: 'TR',
        minimumLevel: 60,
    },
]

export const taskMap: Record<string, Task> = Object.fromEntries(
    taskList.map((task) => [task.key, task])
)


function garrisonCouldGet(char: Character): boolean {
    return userQuestStore.hasAny(char.id, 34586) || userQuestStore.hasAny(char.id, 34378)
}


export const multiTaskMap: Record<string, Chore[]> = {
    'wodGarrison': [
        {
            taskKey: 'invasionBronze',
            taskName: '{item:120320}', // Invader's Abandoned Sack
            couldGetFunc: garrisonCouldGet,
        },
        {
            taskKey: 'invasionSilver',
            taskName: '{item:120319}', // Invader's Damaged Cache
            couldGetFunc: garrisonCouldGet,
        },
        {
            taskKey: 'invasionGold',
            taskName: '{item:116980}', // Invader's Forgotten Treasure
            couldGetFunc: garrisonCouldGet,
        },
        {
            taskKey: 'invasionPlatinum',
            taskName: '{item:122163}', // Routed Invader's Crate of Spoils
            couldGetFunc: garrisonCouldGet,
        },
    ],
    'dfCatchRelease': [
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
    'dfChores': [
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
    'dfChores10_1_0': [
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
    'dfDungeonWeeklies': [
        {
            taskKey: 'dfDungeonPreserving',
            taskName: 'Preserving the Past'
        },
        {
            taskKey: 'dfDungeonRelic',
            taskName: 'Relic Recovery',
        },
    ],
    'dfProfessionWeeklies': [
        {
            taskKey: 'dfProfessionMettle',
            taskName: 'Show Your Mettle',
            minimumLevel: 60,
            couldGetFunc: (char) => some(
                Object.values(get(staticStore).professions).filter((prof) => prof.type === 0),
                (profession) => !!char.professions?.[profession.id]?.[profession.subProfessions[9].id]
            ),
            canGetFunc: (char) => char.reputations?.[2544] >= 500 ? '' : "Need Preferred with Artisan's Consortium",
        },
        ...dragonflightProfessionTasks,
    ],
    'pvpBrawl': [
        {
            taskKey: 'arathiBlizzard',
            taskName: 'Arathi Blizzard',
        },
        {
            taskKey: 'classicAshran',
            taskName: 'Classic Ashran',
        },
        {
            taskKey: 'compStomp',
            taskName: 'Comp Stomp',
        },
        {
            taskKey: 'cookingImpossible',
            taskName: 'Cooking Impossible',
        },
        {
            taskKey: 'deepSix',
            taskName: 'Deep Six',
        },
        {
            taskKey: 'deepwindDunk',
            taskName: 'Deepwind Dunk',
        },
        {
            taskKey: 'gravityLapse',
            taskName: 'Gravity Lapse',
        },
        {
            taskKey: 'packedHouse',
            taskName: 'Packed House',
        },
        {
            taskKey: 'shadoPanShowdown',
            taskName: 'Shado-Pan Showdown',
        },
        {
            taskKey: 'southshoreVsTarrenMill',
            taskName: 'Southshore vs. Tarren Mill',
        },
        {
            taskKey: 'templeOfHotmogu',
            taskName: 'Temple of Hotmogu',
        },
        {
            taskKey: 'warsongScramble',
            taskName: 'Warsong Scramble',
        },
    ],
}

export const pvpBrawlHolidays: Record<number, string> = Object.fromEntries(
    flatten(
        Object.entries({
            arathiBlizzard: [ 666, 673, 680, 697, 737 ],
            classicAshran: [ 1120, 1121, 1122, 1123, 1124 ],
            compStomp: [ 1234, 1235, 1236, 1237, 1238 ],
            cookingImpossible: [ 1047, 1048, 1049, 1050, 1051 ],
            deepSix: [ 702, 704, 705, 706, 736 ],
            deepwindDunk: [ 1239, 1240, 1241, 1242, 1243 ],
            gravityLapse: [ 659, 663, 670, 677, 684 ],
            packedHouse: [ 667, 674, 681, 688, 701 ],
            shadoPanShowdown: [ 1232, 1233, 1244, 1245, 1246, 1312 ],
            southshoreVsTarrenMill: [ 660, 662, 669, 676, 683 ],
            templeOfHotmogu: [ 1166, 1167, 1168, 1169, 1170 ],
            warsongScramble: [ 664, 671, 678, 685, 1221 ],
        })
        .map(([key, values]) => values.map((id) => [id, key]))
    )
)


function couldGet(slug: string, char: Character): boolean {
    const staticData = get(staticStore)

    const profession = staticData.professions[professionSlugToId[slug]]
    return !!char.professions?.[profession.id]?.[profession.subProfessions[9].id]
}

function getLatestSkill(char: Character, slug: string, minSkill: number): string {
    const staticData = get(staticStore)

    const professionId = professionSlugToId[slug]
    const subProfessions = staticData.professions[professionId].subProfessions
    const skill = char.professions[professionId][subProfessions[subProfessions.length - 1].id] ?.currentSkill ?? 0

    return skill < minSkill ? `Need ${minSkill} skill` : ''
}
