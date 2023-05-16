import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'

export const dragonflightHerbalism: DragonflightProfession = {
    id: Profession.Herbalism,
    masterQuestId: 70253,
    bookQuests: [
        {
            itemId: 200980, // Artisan's Consortium, Preferred
            questId: 71897,
            source: 'AC',
        },
        {
            itemId: 201276, // Artisan's Consortium, Valued
            questId: 71908,
            source: 'AC',
        },
        {
            itemId: 201287, // Artisan's Consortium, Esteemed
            questId: 71919,
            source: 'AC',
        },
        {
            itemId: 205358, // Niffen Notebook of Herbalism Knowledge
            questId: 75753,
            source: 'LN',
        },
        {
            itemId: 205445, // Bartered Herbalism Journal
            questId: 75852,
            source: 'ZCB',
        },
        {
            itemId: 205434, // Bartered Herbalism Notes
            questId: 75843,
            source: 'ZCB',
        },
    ],
}
