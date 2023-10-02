import { Profession } from '@/enums/profession'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightEnchanting: DragonflightProfession = {
    id: Profession.Enchanting,
    hasCraft: true,
    masterQuestId: 70251,
    bookQuests: [
        {
            itemId: 200976, // Artisan's Consortium, Preferred
            questId: 71895,
            source: 'AC 2',
        },
        {
            itemId: 201272, // Artisan's Consortium, Valued
            questId: 71906,
            source: 'AC 4',
        },
        {
            itemId: 201283, // Artisan's Consortium, Esteemed
            questId: 71917,
            source: 'AC 5',
        },
        {
            itemId: 201709, // Notebook of Crafting Knowledge
            questId: 72299, // Expedition Crafting Knowledge
            source: 'DE 14',
        },
        {
            itemId: 201709, // Notebook of Crafting Knowledge
            questId: 72304, // Expedition Crafting Knowledge
            source: 'DE 23',
        },
        {
            itemId: 201709, // Notebook of Crafting Knowledge
            questId: 72318, // Iskaaran Crafter's Knowledge
            source: 'IT 14',
        },
        {
            itemId: 201709, // Notebook of Crafting Knowledge
            questId: 72323, // Iskaaran Crafting Mastery
            source: 'IT 24',
        },
        {
            itemId: 205351, // Niffen Notebook of Enchanting Knowledge
            questId: 75752,
            source: 'LN',
        },
        {
            itemId: 205438, // Bartered Enchanting Journal
            questId: 75850,
            source: 'ZCB',
        },
        {
            itemId: 205427, // Bartered Enchanting Notes
            questId: 75845,
            source: 'ZCB',
        },
    ],
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
        {
            itemId: 204224, // Speck of Arcane Awareness
            questId: 74306,
            source: 'FR: Manathema',
        },
    ],
    treasureQuests: [
        {
            itemId: 201012, // Enchanted Debris
            questId: 70272,
            source: 'WS',
        },
        {
            itemId: 198694, // Enriched Earthen Shard
            questId: 70298,
            source: 'AS',
        },
        {
            itemId: 201013, // Faintly Enchanted Remains
            questId: 70290,
            source: 'AS',
        },
        {
            itemId: 198798, // Flashfrozen Scroll
            questId: 70320,
            source: 'WS',
        },
        {
            itemId: 198799, // Forgotten Arcane Tome
            questId: 70336,
            source: 'AS',
        },
        {
            itemId: 198800, // Fractured Titanic Sphere
            questId: 70342,
            source: 'TD',
        },
        {
            itemId: 204990, // Lava-Drenched Shadow Crystal
            questId: 75508,
            source: 'ZC',
        },
        {
            itemId: 198675, // Lava-Infused Seed
            questId: 70283,
            source: 'WS',
        },
        {
            itemId: 205001, // Resonating Arcane Crystal
            questId: 75510,
            source: 'ZC',
        },
        {
            itemId: 204999, // Shimmering Aqueous Orb
            questId: 75509,
            source: 'ZC',
        },
        {
            itemId: 198689, // Stormbound Horn
            questId: 70291,
            source: 'OP',
        },
    ],
}
