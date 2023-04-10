import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightEnchanting: DragonflightProfession = {
    id: Profession.Enchanting,
    hasCraft: true,
    masterQuestId: 70251,
    bookQuests: [
        {
            itemId: 200976, // Artisan's Consortium, Preferred
            questId: 71895,
        },
        {
            itemId: 201272, // Artisan's Consortium, Valued
            questId: 71906,
        },
        {
            itemId: 201283, // Artisan's Consortium, Esteemed
            questId: 71917,
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
}
