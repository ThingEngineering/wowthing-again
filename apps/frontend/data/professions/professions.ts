import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'
import { get } from 'svelte/store'

import { Profession } from '@/enums/profession'
import { staticStore } from '@/stores'
import type { Character } from '@/types'
import type { DragonflightProfession } from '@/types/data'
import type { Chore } from '@/types/tasks'

import { dragonflightAlchemy } from './alchemy'
import { dragonflightBlacksmithing } from './blacksmithing'
import { dragonflightCooking } from './cooking'
import { dragonflightEnchanting } from './enchanting'
import { dragonflightEngineering } from './engineering'
import { dragonflightFishing } from './fishing'
import { dragonflightHerbalism } from './herbalism'
import { dragonflightInscription } from './inscription'
import { dragonflightJewelcrafting } from './jewelcrafting'
import { dragonflightLeatherworking } from './leatherworking'
import { dragonflightMining } from './mining'
import { dragonflightSkinning } from './skinning'
import { dragonflightTailoring } from './tailoring'


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
export const isSecondaryProfession: Record<number, boolean> = {
    794: true, // Archaeology
    185: true, // Cooking
    356: true, // Fishing
}
export const isCraftingProfession: Record<number, boolean> = Object.fromEntries(
    Object.keys(professionIdToString)
        .map((id) => parseInt(id))
        .filter((id) => !isGatheringProfession[id] && !isSecondaryProfession[id])
        .map((id) => [id, true])
)
// I hate that object keys are always strings, ugh
export const professionOrder: number[] = sortBy(
    Object.entries(professionIdToString),
    ([id, slug]) => [
        isSecondaryProfession[parseInt(id)] ? 2 : (isGatheringProfession[parseInt(id)] ? 1 : 0),
        slug
    ].join('|')
)
.map(([id,]) => parseInt(id))

export const professionSpecializationToSpell: Record<string, number> = {
    'Gnomish Engineer': 20219,
    'Goblin Engineer': 20222,
}

export const professionSpecializationSpells: Record<number, string> = Object.fromEntries(
    Object.entries(professionSpecializationToSpell)
        .map(([spellName, spellId]) => [spellId, spellName])
)

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

export const dragonflightProfessions: DragonflightProfession[] = [
    dragonflightAlchemy,
    dragonflightBlacksmithing,
    dragonflightEnchanting,
    dragonflightEngineering,
    dragonflightInscription,
    dragonflightJewelcrafting,
    dragonflightLeatherworking,
    dragonflightTailoring,

    dragonflightHerbalism,
    dragonflightMining,
    dragonflightSkinning,

    dragonflightCooking,
    dragonflightFishing,
]

export const dragonflightProfessionMap: Record<number, DragonflightProfession> = Object.fromEntries(
    dragonflightProfessions
        .map((profession) => [
            profession.id,
            profession,
        ])
)

export const dragonflightProfessionTasks: Chore[] = flatten(
    dragonflightProfessions.map((profession) => {
        const name = Profession[profession.id]
        const lowerName = Profession[profession.id].toLowerCase()
        const tasks: Chore[] = []

        if (profession.hasCraft === true) {
            tasks.push(
                {
                    taskKey: `dfProfession${name}Craft`,
                    taskName: `${name}: Craft`,
                    minimumLevel: 60,
                    couldGetFunc: (char) => couldGet(lowerName, char),
                    canGetFunc: (char) => getLatestSkill(char, lowerName, 45),
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

        tasks.push(
            {
                taskKey: `dfProfession${name}Gather`,
                taskName: `${name}: Gather`,
                minimumLevel: 60,
                couldGetFunc: (char) => couldGet(lowerName, char),
                canGetFunc: (char) => getLatestSkill(char, lowerName, 25),
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
