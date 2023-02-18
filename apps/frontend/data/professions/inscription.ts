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
        },
        {
            itemId: 201269, // Artisan's Consortium, Valued
            questId: 71909,
        },
        {
            itemId: 201280, // Artisan's Consortium, Esteemed
            questId: 71920,
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
    ],
}
