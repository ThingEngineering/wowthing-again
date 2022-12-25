import { get } from 'svelte/store'

import { professionSlugToId } from './professions'
import { staticStore } from '@/stores'
import type { Character } from '@/types'
import type { Chore, Task } from '@/types/tasks'


export const taskList: Task[] = [
    // Misc
    {
        key: 'dmfProfessions',
        name: '[DMF] Professions',
        shortName: 'DMF',
    },

    // Holidays
    {
        key: 'holidayArenaSkirmishes',
        name: '[Holiday] Arena Skirmishes',
        shortName: 'Skirm',
    },
    {
        key: 'holidayBattlegrounds',
        name: '[Holiday] Battlegrounds',
        shortName: 'BGs',
    },
    {
        key: 'holidayDungeons',
        name: '[Holiday] Mythic Dungeons',
        shortName: 'Dung',
    },
    {
        key: 'holidayPetBattles',
        name: '[Holiday] Pet Battles',
        shortName: 'Pets',
    },
    {
        key: 'holidayTimewalking',
        name: '[Holiday] Timewalking',
        shortName: 'TW :exclamation:',
    },
    {
        key: 'holidayWorldQuests',
        name: '[Holiday] World Quests',
        shortName: 'WQs',
    },
    {
        key: 'timewalking',
        name: '[Holiday] Timewalking Item',
        shortName: 'TW :item:',
        minimumLevel: 50,
    },

    // PvP
    {
        key: 'somethingDifferent',
        name: '[PvP] Something Different (Brawl)',
        shortName: 'Brawl',
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
        key: 'slKorthia',
        name: '[SL] Korthia',
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
        key: 'slZerethMortis',
        name: '[SL] Zereth Mortis',
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
        key: 'dfDungeonWeeklies',
        name: '[DF] Dungeon Weeklies',
        shortName: 'Dun',
        type: 'multi',
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
]

export const taskMap: Record<string, Task> = Object.fromEntries(
    taskList.map((task) => [task.key, task])
)

export const multiTaskMap: Record<string, Chore[]> = {
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
            taskKey: 'dfCatchScalebelley',
            taskName: 'Scalebelly Mackerel',
        },
        {
            taskKey: 'dfCatchTemporal',
            taskName: 'Temporal Dragonhead',
        },
        {
            taskKey: 'dfCatchThousandbite',
            taskName: 'ThousandbitePiranha',
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
            minimumLevel: 60,
            taskKey: 'dfTrialElements',
            taskName: 'Trial of Elements',
        },
        {
            minimumLevel: 60,
            taskKey: 'dfTrialFlood',
            taskName: 'Trial of the Flood',
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
        },
        {
            taskKey: 'dfProfessionAlchemyCraft',
            taskName: 'Alchemy: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['alchemy']],
            canGetFunc: (char) => getLatestSkill(char, 'alchemy', 45),
        },
        {
            taskKey: 'dfProfessionAlchemyGather',
            taskName: 'Alchemy: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['alchemy']],
            canGetFunc: (char) => getLatestSkill(char, 'alchemy', 25),
        },

        {
            taskKey: 'dfProfessionBlacksmithingCraft',
            taskName: 'Blacksmithing: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['blacksmithing']],
            canGetFunc: (char) => getLatestSkill(char, 'blacksmithing', 45),
        },
        {
            taskKey: 'dfProfessionBlacksmithingGather',
            taskName: 'Blacksmithing: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['blacksmithing']],
            canGetFunc: (char) => getLatestSkill(char, 'blacksmithing', 25),
        },
        {
            taskKey: 'dfProfessionBlacksmithingOrders',
            taskName: 'Blacksmithing: Orders',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['blacksmithing']],
            canGetFunc: (char) => getLatestSkill(char, 'blacksmithing', 25),
        },

        {
            taskKey: 'dfProfessionEnchantingCraft',
            taskName: 'Enchanting: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['enchanting']],
            canGetFunc: (char) => getLatestSkill(char, 'enchanting', 45),
        },
        {
            taskKey: 'dfProfessionEnchantingGather',
            taskName: 'Enchanting: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['enchanting']],
            canGetFunc: (char) => getLatestSkill(char, 'enchanting', 25),
        },

        {
            taskKey: 'dfProfessionEngineeringCraft',
            taskName: 'Engineering: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['engineering']],
            canGetFunc: (char) => getLatestSkill(char, 'engineering', 45),
        },
        {
            taskKey: 'dfProfessionEngineeringGather',
            taskName: 'Engineering: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['engineering']],
            canGetFunc: (char) => getLatestSkill(char, 'engineering', 25),
        },
        {
            taskKey: 'dfProfessionEngineeringOrders',
            taskName: 'Engineering: Orders',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['engineering']],
            canGetFunc: (char) => getLatestSkill(char, 'engineering', 25),
        },

        {
            taskKey: 'dfProfessionHerbalismGather',
            taskName: 'Herbalism: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['herbalism']],
            canGetFunc: (char) => getLatestSkill(char, 'herbalism', 25),
        },

        {
            taskKey: 'dfProfessionInscriptionCraft',
            taskName: 'Inscription: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['inscription']],
            canGetFunc: (char) => getLatestSkill(char, 'inscription', 45),
        },
        {
            taskKey: 'dfProfessionInscriptionGather',
            taskName: 'Inscription: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['inscription']],
            canGetFunc: (char) => getLatestSkill(char, 'inscription', 25),
        },
        {
            taskKey: 'dfProfessionInscriptionOrders',
            taskName: 'Inscription: Orders',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['inscription']],
            canGetFunc: (char) => getLatestSkill(char, 'inscription', 25),
        },

        {
            taskKey: 'dfProfessionJewelcraftingCraft',
            taskName: 'Jewelcrafting: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['jewelcrafting']],
            canGetFunc: (char) => getLatestSkill(char, 'jewelcrafting', 45),
        },
        {
            taskKey: 'dfProfessionJewelcraftingGather',
            taskName: 'Jewelcrafting: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['jewelcrafting']],
            canGetFunc: (char) => getLatestSkill(char, 'jewelcrafting', 25),
        },
        {
            taskKey: 'dfProfessionJewelcraftingOrders',
            taskName: 'Jewelcrafting: Orders',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['jewelcrafting']],
            canGetFunc: (char) => getLatestSkill(char, 'jewelcrafting', 25),
        },

        {
            taskKey: 'dfProfessionLeatherworkingCraft',
            taskName: 'Leatherworking: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['leatherworking']],
            canGetFunc: (char) => getLatestSkill(char, 'leatherworking', 45),
        },
        {
            taskKey: 'dfProfessionLeatherworkingGather',
            taskName: 'Leatherworking: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['leatherworking']],
            canGetFunc: (char) => getLatestSkill(char, 'leatherworking', 25),
        },
        {
            taskKey: 'dfProfessionLeatherworkingOrders',
            taskName: 'Leatherworking: Orders',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['leatherworking']],
            canGetFunc: (char) => getLatestSkill(char, 'leatherworking', 25),
        },

        {
            taskKey: 'dfProfessionMiningGather',
            taskName: 'Mining: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['mining']],
            canGetFunc: (char) => getLatestSkill(char, 'mining', 25),
        },

        {
            taskKey: 'dfProfessionSkinningGather',
            taskName: 'Skinning: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['skinning']],
            canGetFunc: (char) => getLatestSkill(char, 'skinning', 25),
        },

        {
            taskKey: 'dfProfessionTailoringCraft',
            taskName: 'Tailoring: Craft',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['tailoring']],
            canGetFunc: (char) => getLatestSkill(char, 'tailoring', 45),
        },
        {
            taskKey: 'dfProfessionTailoringGather',
            taskName: 'Tailoring: Gather',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['tailoring']],
            canGetFunc: (char) => getLatestSkill(char, 'tailoring', 25),
        },
        {
            taskKey: 'dfProfessionTailoringOrders',
            taskName: 'Tailoring: Orders',
            couldGetFunc: (char) => !!char.professions?.[professionSlugToId['tailoring']],
            canGetFunc: (char) => getLatestSkill(char, 'tailoring', 25),
        },
    ],
}

function getLatestSkill(char: Character, slug: string, minSkill: number): string {
    const staticData = get(staticStore).data

    const professionId = professionSlugToId[slug]
    const subProfessions = staticData.professions[professionId].subProfessions
    const skill = char.professions[professionId][subProfessions[subProfessions.length - 1].id] ?.currentSkill ?? 0

    return skill < minSkill ? `Need ${minSkill} skill` : ''
}
