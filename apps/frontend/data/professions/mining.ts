import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'

export const dragonflightMining: DragonflightProfession = {
    id: Profession.Mining,
    masterQuestId: 70258,
    bookQuests: [
        {
            itemId: 200981, // Artisan's Consortium, Preferred
            questId: 71901,
            source: 'AC',
        },
        {
            itemId: 201277, // Artisan's Consortium, Valued
            questId: 71912,
            source: 'AC',
        },
        {
            itemId: 201288, // Artisan's Consortium, Esteemed
            questId: 71923,
            source: 'AC',
        },
        {
            itemId: 205356, // Niffen Notebook of Mining Knowledge
            questId: 75758,
            source: 'LN',
        },
    ],
}
