import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightEngineering: DragonflightProfession = {
    id: Profession.Engineering,
    hasCraft: true,
    hasOrders: true,
    masterQuestId: 70252,
    bookQuests: [
        {
            itemId: 200977, // Artisan's Consortium, Preferred
            questId: 71896,
            source: 'AC',
        },
        {
            itemId: 201273, // Artisan's Consortium, Valued
            questId: 71907,
            source: 'AC',
        },
        {
            itemId: 201284, // Artisan's Consortium, Esteemed
            questId: 71918,
            source: 'AC',
        },
        {
            itemId: 205349, // Niffen Notebook of Engineering Knowledge
            questId: 75759,
            source: 'LN',
        },
    ],
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
        {
            itemId: 204227, // Everflowing Antifreeze
            questId: 74330,
            source: 'FR: Fimbol',
        },
    ],
    treasureQuests: [
        {
            itemId: 201014, // Boomthyr Rocket,
            questId: 70270,
            source: 'WS',
        },
        {
            itemId: 204475, // Busted Wyrmhole Generator
            questId: 75186,
            source: 'ZC',
        },
        {
            itemId: 204471, // Defective Survival Pack
            questId: 75184,
            source: 'ZC',
        },
        {
            itemId: 204853, // Discarded Dracothyst Drill
            questId: 75431,
            source: 'ZC',
        },
        {
            itemId: 204850, // Handful of Khaz'gorite Bolts
            questId: 75430,
            source: 'ZC',
        },
        {
            itemId: 204470, // Haphazardly Discarded Bomb
            questId: 75183,
            source: 'ZC',
        },
        {
            itemId: 204480, // Inconspicuous Data Miner
            questId: 75188,
            source: 'ZC',
        },
        {
            itemId: 198789, // Intact Coil Capacitor
            questId: 70275,
            source: 'WS',
        },
        {
            itemId: 204469, // Misplaced Aberrus Outflow Blueprints
            questId: 75180,
            source: 'ZC',
        },
        {
            itemId: 204855, // Overclocked Determination Core
            questId: 75433,
            source: 'ZC',
        },        
    ]
}
