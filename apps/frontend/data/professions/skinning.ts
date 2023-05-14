import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'

export const dragonflightSkinning: DragonflightProfession = {
    id: Profession.Skinning,
    masterQuestId: 70259,
    bookQuests: [
        {
            itemId: 200982, // Artisan's Consortium, Preferred
            questId: 71902,
            source: 'AC',
        },
        {
            itemId: 201278, // Artisan's Consortium, Valued
            questId: 71913,
            source: 'AC',
        },
        {
            itemId: 201289, // Artisan's Consortium, Esteemed
            questId: 71924,
            source: 'AC',
        },
        {
            itemId: 205357, // Niffen Notebook of Skinning Knowledge
            questId: 75760,
            source: 'LN',
        },
    ],
}
