import { get } from 'svelte/store'

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

type DragonflightProfessionTask = {
    name: string
    hasCraft?: boolean
    hasOrders?: boolean
}
const dragonflightProfessions: DragonflightProfessionTask[] = [
    {
        name: 'Alchemy',
        hasCraft: true,
    },
    {
        name: 'Blacksmithing',
        hasCraft: true,
        hasOrders: true,
    },
    {
        name: 'Enchanting',
        hasCraft: true,
    },
    {
        name: 'Engineering',
        hasCraft: true,
        hasOrders: true,
    },
    {
        name: 'Herbalism',
    },
    {
        name: 'Inscription',
        hasCraft: true,
        hasOrders: true,
    },
    {
        name: 'Jewelcrafting',
        hasCraft: true,
        hasOrders: true,
    },
    {
        name: 'Leatherworking',
        hasCraft: true,
        hasOrders: true,
    },
    {
        name: 'Mining',
    },
    {
        name: 'Skinning',
    },
    {
        name: 'Tailoring',
        hasCraft: true,
        hasOrders: true,
    },
]

export const dragonflightProfessionTasks: Chore[] = []
for (const profession of dragonflightProfessions) {
    const lowerName = profession.name.toLowerCase()
    
    if (profession.hasCraft === true) {
        dragonflightProfessionTasks.push(
            {
                taskKey: `dfProfession${profession.name}Craft`,
                taskName: `${profession.name}: Craft`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
                canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
            },
        )
    }

    dragonflightProfessionTasks.push(
        {
            taskKey: `dfProfession${profession.name}Drop#`,
            taskName: `${profession.name}: Drops`,
            minimumLevel: 60,
            couldGetFunc: (char) => couldGet(lowerName, char),
            //canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
        },
    )

    dragonflightProfessionTasks.push(
        {
            taskKey: `dfProfession${profession.name}Gather`,
            taskName: `${profession.name}: Gather`,
            minimumLevel: 60,
            couldGetFunc: (char) => couldGet(lowerName, char),
            canGetFunc: (char) => getLatestSkill(char, lowerName, 25),
        },
    )

    if (profession.hasOrders === true) {
        dragonflightProfessionTasks.push(
            {
                taskKey: `dfProfession${profession.name}Orders`,
                taskName: `${profession.name}: Orders`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
                canGetFunc: (char) => getLatestSkill(char, lowerName, 25),
            },
        )
    }

    dragonflightProfessionTasks.push(
        {
            taskKey: `dfProfession${profession.name}Treatise`,
            taskName: `${profession.name}: Treatise`,
            minimumLevel: 60,
            couldGetFunc: (char) => couldGet(lowerName, char),
        },
    )
}


function couldGet(slug: string, char: Character): boolean {
    const staticData = get(staticStore).data

    const profession = staticData.professions[professionSlugToId[slug]]
    return !!char.professions?.[profession.id]?.[profession.subProfessions[9].id]
}

function getLatestSkill(char: Character, slug: string, minSkill: number): string {
    const staticData = get(staticStore).data

    const professionId = professionSlugToId[slug]
    const subProfessions = staticData.professions[professionId].subProfessions
    const skill = char.professions[professionId][subProfessions[subProfessions.length - 1].id] ?.currentSkill ?? 0

    return skill < minSkill ? `Need ${minSkill} skill` : ''
}
