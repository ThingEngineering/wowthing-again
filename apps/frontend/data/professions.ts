import { get } from 'svelte/store'

import { Profession } from '@/enums'
import { staticStore } from '@/stores'
import type { Character } from '@/types'
import type { Chore } from '@/types/tasks'


export const professionIdToString: Record<number, string> = {
    171: 'alchemy',
    164: 'blacksmithing',
    333: 'enchanting',
    202: 'engineering',
    182: 'herbalism',
    773: 'inscription',
    755: 'jewelcrafting',
    165: 'leatherworking',
    186: 'mining',
    393: 'skinning',
    197: 'tailoring',

    794: 'archaeology',
    185: 'cooking',
    356: 'fishing',
}

export const professionSlugToId: Record<string, number> = Object.fromEntries(
    Object.entries(professionIdToString)
        .map(([id, slug]) => [slug, parseInt(id)])
)

export const isGatheringProfession: Record<number, boolean> = {
    182: true, // Herbalism
    186: true, // Mining
    393: true, // Skinning
}

export const darkmoonFaireProfessionQuests: Record<number, number> = {
    171: 29506, // Alchemy - A Fizzy Fusion
    164: 29508, // Blacksmithing - Baby Needs Two Pair of Shoes
    333: 29510, // Enchanting - Putting Trash to Good Use
    202: 29511, // Engineering - Talkin' Tonks
    182: 29514, // Herbalism - Herbs for Healing
    773: 29515, // Inscription - Writing the Future
    755: 29516, // Jewelcrafting - Keeping the Faire Sparkling
    165: 29517, // Leatherworking - Eyes on the Prizes
    186: 29518, // Mining - Rearm, Reuse, Recycle
    393: 29519, // Skinning - Tan My Hide
    197: 29520, // Tailoring - Banners, Banners Everywhere!

    794: 29507, // Archaeology - Fun for the Little Ones
    185: 29509, // Cooking - Putting the Crunch in the Frog
    356: 29513, // Fishing - Spoilin' for Salty Sea Dogs
}

type DragonflightProfession = {
    id: Profession
    hasCraft?: boolean
    hasOrders?: boolean
    masterQuestId?: number
    treasureQuests?: [number, number][]
}
const dragonflightProfessions: DragonflightProfession[] = [
    {
        id: Profession.Alchemy,
        hasCraft: true,
    },
    {
        id: Profession.Blacksmithing,
        hasCraft: true,
        hasOrders: true,
        masterQuestId: 70250,
        treasureQuests: [
            [70246, 201007], // Ancient Monument
            [70313, 201004], // Ancient Spear Shards
            [70312, 201005], // Curious Ingots
            [70311, 201006], // Draconic Flux
            [70353, 201009], // Falconer Gauntlet Drawings
            [70314, 198791], // Glimmer of Blacksmithing Wisdom
            [70296, 201008], // Molten Ingot
            [70310, 201010], // Qalashi Weapon Diagram
            [70314, 201011], // Spelltouched Tongs
        ],
    },
    {
        id: Profession.Enchanting,
        hasCraft: true,
    },
    {
        id: Profession.Engineering,
        hasCraft: true,
        hasOrders: true,
    },
    {
        id: Profession.Herbalism,
    },
    {
        id: Profession.Inscription,
        hasCraft: true,
        hasOrders: true,
    },
    {
        id: Profession.Jewelcrafting,
        hasCraft: true,
        hasOrders: true,
    },
    {
        id: Profession.Leatherworking,
        hasCraft: true,
        hasOrders: true,
    },
    {
        id: Profession.Mining,
    },
    {
        id: Profession.Skinning,
    },
    {
        id: Profession.Tailoring,
        hasCraft: true,
        hasOrders: true,
    },
]

type DragonflightProfessionQuests = {
    masterQuestId: number
    treasureQuests: {
        questId: number
        itemId: number
    }[]
}
export const dragonflightProfessionQuests: Record<number, DragonflightProfessionQuests> = {}
export const dragonflightProfessionTasks: Chore[] = []

for (const profession of dragonflightProfessions) {
    const name = Profession[profession.id]
    const lowerName = Profession[profession.id].toLowerCase()
    
    if (profession.masterQuestId && profession.treasureQuests) {
        dragonflightProfessionQuests[profession.id] = {
            masterQuestId: profession.masterQuestId,
            treasureQuests: profession.treasureQuests
                .map(([questId, itemId]) => ({
                    questId,
                    itemId,
                }))
        }
    }

    if (profession.hasCraft === true) {
        dragonflightProfessionTasks.push(
            {
                taskKey: `dfProfession${name}Craft`,
                taskName: `${name}: Craft`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
                canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
            },
        )
    }

    dragonflightProfessionTasks.push(
        {
            taskKey: `dfProfession${name}Drop#`,
            taskName: `${name}: Drops`,
            minimumLevel: 60,
            couldGetFunc: (char) => couldGet(lowerName, char),
            //canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
        },
    )

    dragonflightProfessionTasks.push(
        {
            taskKey: `dfProfession${name}Gather`,
            taskName: `${name}: Gather`,
            minimumLevel: 60,
            couldGetFunc: (char) => couldGet(lowerName, char),
            canGetFunc: (char) => getLatestSkill(char, lowerName, 25),
        },
    )

    if (profession.hasOrders === true) {
        dragonflightProfessionTasks.push(
            {
                taskKey: `dfProfession${name}Orders`,
                taskName: `${name}: Orders`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
                canGetFunc: (char) => getLatestSkill(char, lowerName, 25),
            },
        )
    }

    dragonflightProfessionTasks.push(
        {
            taskKey: `dfProfession${name}Treatise`,
            taskName: `${name}: Treatise`,
            minimumLevel: 60,
            couldGetFunc: (char) => couldGet(lowerName, char),
        },
    )
}


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
