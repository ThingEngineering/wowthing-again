import { Profession } from '@/enums/profession'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightAlchemy: DragonflightProfession = {
    id: Profession.Alchemy,
    subProfessionId: 2823,
    hasTask: true,
    masterQuestId: 70247,
    bookQuests: [
        {
            itemId: 200974, // Artisan's Consortium, Preferred
            questId: 71893,
            source: 'AC 2',
        },
        {
            itemId: 201270, // Artisan's Consortium, Valued
            questId: 71904,
            source: 'AC 4',
        },
        {
            itemId: 201281, // Artisan's Consortium, Esteemed
            questId: 71915,
            source: 'AC 5',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 72311, // A Gift of Knowledge
            source: 'MC 14',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 72314, // A Gift of Secrets
            source: 'MC 24',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 70892, // Crafting Your Start
            source: 'VA 14',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 70889, // Crafting for Expertise
            source: 'VA 24',
        },
        {
            itemId: 205353, // Niffen Notebook of Alchemy Knowledge
            questId: 75756,
            source: 'LN',
        },
        {
            itemId: 205440, // Bartered Alchemy Journal
            questId: 75848,
            source: 'ZCB',
        },
        {
            itemId: 205429, // Bartered Alchemy Notes
            questId: 75847,
            source: 'ZCB',
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
        {
            itemId: 210190, // Blazeroot
            questId: 78275,
            source: 'ED',
        },
        {
            itemId: 210184, // Half-Filled Dreamless Sleep Potion
            questId: 78264,
            source: 'ED',
        },
        {
            itemId: 210185, // Splash Potion of Narcolepsy
            questId: 78269,
            source: 'ED',
        },
    ],
}
