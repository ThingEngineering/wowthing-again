import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'

export const dragonflightHerbalism: DragonflightProfession = {
    id: Profession.Herbalism,
    masterQuestId: 70253,
    bookQuests: [
        {
            itemId: 200980, // Artisan's Consortium, Preferred
            questId: 71897,
        },
        {
            itemId: 201276, // Artisan's Consortium, Valued
            questId: 71908,
        },
        {
            itemId: 201287, // Artisan's Consortium, Esteemed
            questId: 71919,
        },
    ],
}
