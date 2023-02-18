import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightLeatherworking: DragonflightProfession = {
    id: Profession.Leatherworking,
    hasCraft: true,
    hasOrders: true,
    masterQuestId: 70256,
    bookQuests: [
        {
            itemId: 200979, // Artisan's Consortium, Preferred
            questId: 71900,
        },
        {
            itemId: 201275, // Artisan's Consortium, Valued
            questId: 71911,
        },
        {
            itemId: 201286, // Artisan's Consortium, Esteemed
            questId: 71922,
        },
    ],
    dropQuests: [
        {
            itemId: 193910, // Molted Dragon Scales
            questId: 66384,
            source: 'Treasures',
        },
        {
            itemId: 193913, // Preserved Animal Parts
            questId: 66385,
            source: 'Treasures',
        },
        {
            itemId: 198975, // Ossified Hide
            questId: 70522,
            source: 'Mobs: Proto-Drakes',
        },
        {
            itemId: 198976, // Extremely Soft Skin
            questId: 70523,
            source: 'Mobs: Slyvern & Vorquin',
        },
    ],
}
