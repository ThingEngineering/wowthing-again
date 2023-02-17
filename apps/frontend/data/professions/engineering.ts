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
        },
        {
            itemId: 201273, // Artisan's Consortium, Valued
            questId: 71907,
        },
        {
            itemId: 201284, // Artisan's Consortium, Esteemed
            questId: 71918,
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
    ],
}
