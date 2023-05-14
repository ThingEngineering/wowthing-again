import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightAlchemy: DragonflightProfession = {
    id: Profession.Alchemy,
    hasCraft: true,
    masterQuestId: 70247,
    bookQuests: [
        {
            itemId: 200974, // Artisan's Consortium, Preferred
            questId: 71893,
            source: 'AC',
        },
        {
            itemId: 201270, // Artisan's Consortium, Valued
            questId: 71904,
            source: 'AC',
        },
        {
            itemId: 201281, // Artisan's Consortium, Esteemed
            questId: 71915,
            source: 'AC',
        },
        {
            itemId: 205353, // Niffen Notebook of Alchemy Knowledge
            questId: 75756,
            source: 'LN',
        },
        {
            itemId: 205440, // Bartered Alchemy Journal
            questId: 75848,
            source: 'ZC',
        },
        {
            itemId: 205429, // Bartered Alchemy Notes
            questId: 75847,
            source: 'ZC',
        },
    ],
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
        {
            itemId: 204226, // Blazehoof Ashes
            questId: 74331,
            source: 'FR: Agni Blazehoof',
        },
    ],
    treasureQuests: [
        {
            itemId: 198710, // Canteen of Suspicious Water
            questId: 70305,
            source: 'OP',
        },
        {
            itemId: 198697, // Contraband Concoction
            questId: 70301,
            source: 'TD',
        },
        {
            itemId: 198599, // Experimental Decay Sample
            questId: 70208,
            source: 'AS',
        },
        {
            itemId: 198663, // Frostforged Potion
            questId: 70274,
            source: 'WS',
        },
        {
            itemId: 205212, // Marrow-Ripened Slime
            questId: 75649,
            source: 'ZC',
        },
        {
            itemId: 205211, // Nutrient Diluted Protofluid
            questId: 75646,
            source: 'ZC',
        },
        {
            itemId: 198712, // Small Basket of Firewater Powder
            questId: 70309,
            source: 'AS',
        },
        {
            itemId: 205213, // Suspicious Mold
            questId: 75651,
            source: 'ZC',
        },
        {
            itemId: 203471, // Tasty Candy
            questId: 70278,
            source: 'TD',
        },
        {
            itemId: 198685, // Well Insulated Mug
            questId: 70289,
            source: 'WS',
        },
    ],
}
