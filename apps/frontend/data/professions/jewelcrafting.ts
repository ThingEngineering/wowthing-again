import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightJewelcrafting: DragonflightProfession = {
    id: Profession.Jewelcrafting,
    hasCraft: true,
    hasOrders: true,
    masterQuestId: 70255,
    bookQuests: [
        {
            itemId: 200978, // Artisan's Consortium, Preferred
            questId: 71899,
        },
        {
            itemId: 201274, // Artisan's Consortium, Valued
            questId: 71910,
        },
        {
            itemId: 201285, // Artisan's Consortium, Esteemed
            questId: 71921,
        },
    ],
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
        {
            itemId: 204222, // Conductive Ametrine Shard
            questId: 74333,
            source: 'FR: Amephyst',
        },
    ],
    treasureQuests: [
        {
            itemId: 198682, // Alexstraszite Cluster
            questId: 70285,
        },
        {
            itemId: 198687, // Closely Guarded Shiny
            questId: 70292,
        },
        {
            itemId: 198664, // Crystalline Overgrowth
            questId: 70277,
        },
        {
            itemId: 198660, // Fragmented Key
            questId: 70263,
        },
        {
            itemId: 201016, // Harmonic Crystal Harmonizer
            questId: 70271,
        },
        {
            itemId: 201017, // Igneous Gem
            questId: 70273,
        },
        {
            itemId: 198670, // Lofty Malygite
            questId: 70282,
        },
        {
            itemId: 198656, // Painter's Pretty Jewel
            questId: 70261,
        },
    ],
}
