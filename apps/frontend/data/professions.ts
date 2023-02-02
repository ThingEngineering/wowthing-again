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

interface DragonflightProfessionQuest {
    itemId: number
    questId: number
    source?: string
}

export type DragonflightProfession = {
    id: Profession
    hasCraft?: boolean
    hasOrders?: boolean
    masterQuestId?: number
    dropQuests?: DragonflightProfessionQuest[]
    treasureQuests?: DragonflightProfessionQuest[]
}
const dragonflightProfessions: DragonflightProfession[] = [
    {
        id: Profession.Alchemy,
        hasCraft: true,
        masterQuestId: 70247,
        dropQuests: [
            {
                itemId: 193891, // Experimental Substance
                questId: 66373,
                source: 'Treasures',
            },
            {
                itemId: 193897, // Reawakened Catalyst
                questId: 66374,
                source: 'Treasures',
            },
            {
                itemId: 198963, // Decaying Phlegm
                questId: 70504,
                source: 'Mobs: Decay',
            },
            {
                itemId: 198964, // Elementious Splinter
                questId: 70511,
                source: 'Mobs: Elemental',
            },
        ],
    },
    {
        id: Profession.Blacksmithing,
        hasCraft: true,
        hasOrders: true,
        masterQuestId: 70250,
        dropQuests: [
            {
                itemId: 192131, // Valdrakken Weapon Chain
                questId: 66381,
                source: 'Treasures',
            },
            {
                itemId: 192132, // Draconium Blade Sharpener
                questId: 66382,
                source: 'Treasures',
            },
            {
                itemId: 198965, // Primeval Earth Fragment
                questId: 70512,
                source: 'Mobs: Earth',
            },
            {
                itemId: 198966, // Molten Globule
                questId: 66381,
                source: 'Mobs: Fire',
            },
        ],
        treasureQuests: [
            {
                itemId: 201007, // Ancient Monument
                questId: 70246,
            },
            {
                itemId: 201004, // Ancient Spear Shards
                questId: 70313,
            },
            {
                itemId: 201005, // Curious Ingots
                questId: 70312,
            },
            {
                itemId: 201006, // Draconic Flux
                questId: 70311,
            },
            {
                itemId: 201009, // Falconer Gauntlet Drawings
                questId: 70353,
            },
            {
                itemId: 198791, // Glimmer of Blacksmithing Wisdom
                questId: 70314,
            },
            {
                itemId: 201008, // Molten Ingot
                questId: 70296,
            },
            {
                itemId: 201010, // Qalashi Weapon Diagram
                questId: 70310,
            },
            {
                itemId: 201011, // Spelltouched Tongs
                questId: 70314,
            },
        ],
    },
    {
        id: Profession.Enchanting,
        hasCraft: true,
        masterQuestId: 70251,
        dropQuests: [
            {
                itemId: 193900, // Prismatic Focusing Shard
                questId: 66377,
                source: 'Treasures',
            },
            {
                itemId: 193901, // Primal Dust
                questId: 66378,
                source: 'Treasures',
            },
            {
                itemId: 198967, // Primordial Aether
                questId: 70514,
                source: 'Mobs: Arcane',
            },
            {
                itemId: 198968, // Primalist Charm
                questId: 70515,
                source: 'Mobs: Primalist',
            },
        ],
    },
    {
        id: Profession.Engineering,
        hasCraft: true,
        hasOrders: true,
        masterQuestId: 70252,
        dropQuests: [
            {
                itemId: 193902, // Eroded Titan Gizmo
                questId: 66379,
                source: 'Treasures',
            },
            {
                itemId: 193903, // Watcher Power Core
                questId: 66380,
                source: 'Treasures',
            },
            {
                itemId: 198969, // Keeper's Mark
                questId: 70516,
                source: 'Mobs: Keeper',
            },
            {
                itemId: 198970, // Infinitely Attachable Pair o' Docks
                questId: 70517,
                source: 'Mobs: Dragonkin',
            },
        ],
    },
    {
        id: Profession.Inscription,
        hasCraft: true,
        hasOrders: true,
        masterQuestId: 70254,
        dropQuests: [
            {
                itemId: 193904, // Phoenix Feather Quill
                questId: 66375,
                source: 'Treasures',
            },
            {
                itemId: 193905, // Iskaaran Trading Ledger
                questId: 66376,
                source: 'Treasures',
            },
            {
                itemId: 198971, // Curious Djaradin Rune
                questId: 70518,
                source: 'Mobs: Djaradin',
            },
            {
                itemId: 198972, // Draconic Glamour
                questId: 70519,
                source: 'Mobs: Dragonkin',
            },
        ],
    },
    {
        id: Profession.Jewelcrafting,
        hasCraft: true,
        hasOrders: true,
        masterQuestId: 70255,
        dropQuests: [
            {
                itemId: 193909, // Ancient Gem Fragments
                questId: 66388,
                source: 'Treasures', // 
            },
            {
                itemId: 193907, // Chipped Tyrstone
                questId: 66389,
                source: 'Treasures',
            },
            {
                itemId: 198973, // Incandescent Curio
                questId: 70520,
                source: 'Mobs: Elemental',
            },
            {
                itemId: 198974, // Elegantly Engrabed Embellishment
                questId: 70521,
                source: 'Mobs: Dragonkin',
            },
        ],
    },
    {
        id: Profession.Leatherworking,
        hasCraft: true,
        hasOrders: true,
        masterQuestId: 70256,
        dropQuests: [
            {
                itemId: 193910, // Molted Dragon Scales
                questId: 66384,
                source: 'Treasures',
            },
            {
                itemId: 193913, // Preserved Animal Parts
                questId: 66385,
                source: 'Treasures',
            },
            {
                itemId: 198975, // Ossified Hide
                questId: 70522,
                source: 'Mobs: Proto-Drakes',
            },
            {
                itemId: 198976, // Extremely Soft Skin
                questId: 70523,
                source: 'Mobs: Slyvern & Vorquin',
            },
        ],
    },
    {
        id: Profession.Tailoring,
        hasCraft: true,
        hasOrders: true,
        masterQuestId: 70260,
        dropQuests: [
            {
                itemId: 193898, // Umbral Bone Needle
                questId: 66386,
                source: 'Treasures',
            },
            {
                itemId: 193899, // Primalweave Spindle
                questId: 66387,
                source: 'Treasures',
            },
            {
                itemId: 198977, // Ohn'ahran Weave
                questId: 70524,
                source: 'Mobs: Centaur',
            },
            {
                itemId: 198978, // Stupidly Effective Stitchery
                questId: 70525,
                source: 'Mobs: Gnoll',
            },
        ],
    },

    {
        id: Profession.Herbalism,
        masterQuestId: 70253,
    },
    {
        id: Profession.Mining,
        masterQuestId: 70258,
    },
    {
        id: Profession.Skinning,
        masterQuestId: 70259,
    },
]

export const dragonflightProfessionMap: Record<number, DragonflightProfession> = Object.fromEntries(
    dragonflightProfessions
        .map((profession) => [
            profession.id,
            profession,
        ])
)

export const dragonflightProfessionTasks: Chore[] = []

for (const profession of dragonflightProfessions) {
    const name = Profession[profession.id]
    const lowerName = Profession[profession.id].toLowerCase()

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
