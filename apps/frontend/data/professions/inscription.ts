import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightInscription: DragonflightProfession = {
    id: Profession.Inscription,
    hasCraft: true,
    hasOrders: true,
    masterQuestId: 70254,
    bookQuests: [
        {
            itemId: 200973, // Artisan's Consortium, Preferred
            questId: 71898,
            source: 'AC',
        },
        {
            itemId: 201269, // Artisan's Consortium, Valued
            questId: 71909,
            source: 'AC',
        },
        {
            itemId: 201280, // Artisan's Consortium, Esteemed
            questId: 71920,
            source: 'AC',
        },
        {
            itemId: 205354, // Niffen Notebook of Inscription Knowledge
            questId: 75761,
            source: 'LN',
        },
        {
            itemId: 205441, // Bartered Inscription Journal
            questId: 75853,
            source: 'ZC',
        },
        {
            itemId: 205430, // Bartered Inscription Notes
            questId: 75842,
            source: 'ZC',
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
    ]
}
