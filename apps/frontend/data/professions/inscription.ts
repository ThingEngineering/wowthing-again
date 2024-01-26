import { Profession } from '@/enums/profession'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightInscription: DragonflightProfession = {
    id: Profession.Inscription,
    subProfessionId: 2828,
    hasTask: true,
    hasOrders: true,
    masterQuestId: 70254,
    bookQuests: [
        {
            itemId: 200973, // Artisan's Consortium, Preferred
            questId: 71898,
            source: 'AC 2',
        },
        {
            itemId: 201269, // Artisan's Consortium, Valued
            questId: 71909,
            source: 'AC 4',
        },
        {
            itemId: 201280, // Artisan's Consortium, Esteemed
            questId: 71920,
            source: 'AC 5',
        },
        {
            itemId: 201711, // Notebook of Crafting Knowledge
            questId: 72294, // Expedition Crafting Knowledge
            source: 'DE 14',
        },
        {
            itemId: 201711, // Notebook of Crafting Knowledge
            questId: 72295, // Expedition Crafting Knowledge
            source: 'DE 23',
        },
        {
            itemId: 201711, // Notebook of Crafting Knowledge
            questId: 72331, // Crafting Your Start
            source: 'VA 14',
        },
        {
            itemId: 201711, // Notebook of Crafting Knowledge
            questId: 72334, // Crafting for Expertise
            source: 'VA 24',
        },
        {
            itemId: 205354, // Niffen Notebook of Inscription Knowledge
            questId: 75761,
            source: 'LN',
        },
        {
            itemId: 205441, // Bartered Inscription Journal
            questId: 75853,
            source: 'ZCB',
        },
        {
            itemId: 205430, // Bartered Inscription Notes
            questId: 75842,
            source: 'ZCB',
        },
    ],
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
        {
            itemId: 204229, // Glimmering Rune of Arcantrix
            questId: 74328,
            source: 'FR: Arcantrix',
        },
    ],
    treasureQuests: [
        {
            itemId: 206035, // Ancient Research
            questId: 76121,
            source: 'ZC',
        },
        {
            itemId: 201015, // Counterfeit Darkmoon Deck
            questId: 70287,
            source: 'TD',
        },
        {
            itemId: 198693, // Dusty Darkmoon Card
            questId: 70297,
            source: 'AS',
        },
        {
            itemId: 198659, // Forgetful Apprentice's Tome 1
            questId: 70248,
            source: 'TD',
        },
        {
            itemId: 198659, // Forgetful Apprentice's Tome 2
            questId: 70264,
            source: 'TD',
        },
        {
            itemId: 198686, // Frosted Parchment
            questId: 70293,
            source: 'AS',
        },
        {
            itemId: 206034, // Hissing Rune Draft
            questId: 76120,
            source: 'ZC',
        },
        {
            itemId: 198669, // How to Train Your Whelpling
            questId: 70281,
            source: 'VD',
        },
        {
            itemId: 206031, // Intricate Zaqali Runes
            questId: 76117,
            source: 'ZC',
        },
        {
            itemId: 198704, // Pulsing Earth Rune
            questId: 70306,
            source: 'WS',
        },
        {
            itemId: 198703, // Sign Language Reference Sheet
            questId: 70307,
            source: 'OP',
        },
        {
            itemId: 210459, // Grove Keeper's Pillar
            questId: 78412,
            source: 'ED',
        },
        {
            itemId: 210460, // Primalist Shadowbinding Rune
            questId: 78413,
            source: 'ED',
        },
        {
            itemId: 210458, // Winnie's Notes on Flora and Fauna
            questId: 78411,
            source: 'ED',
        },
    ]
}
