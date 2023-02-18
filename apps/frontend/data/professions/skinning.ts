import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'

export const dragonflightSkinning: DragonflightProfession = {
    id: Profession.Skinning,
    masterQuestId: 70259,
    bookQuests: [
        {
            itemId: 200982, // Artisan's Consortium, Preferred
            questId: 71902,
        },
        {
            itemId: 201278, // Artisan's Consortium, Valued
            questId: 71913,
        },
        {
            itemId: 201289, // Artisan's Consortium, Esteemed
            questId: 71924,
        },
    ],
}
