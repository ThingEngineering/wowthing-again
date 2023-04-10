import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightAlchemy: DragonflightProfession = {
    id: Profession.Alchemy,
    hasCraft: true,
    masterQuestId: 70247,
    bookQuests: [
        {
            itemId: 200974, // Artisan's Consortium, Preferred
            questId: 71893,
        },
        {
            itemId: 201270, // Artisan's Consortium, Valued
            questId: 71904,
        },
        {
            itemId: 201281, // Artisan's Consortium, Esteemed
            questId: 71915,
        },
    ],
    dropQuests: [
        {
            itemId: 193891, // Experimental Substance
            questId: 66373,
            source: 'Treasures',
        },
        {
            itemId: 193897, // Reawakened Catalyst
            questId: 66374,
            source: 'Treasures',
        },
        {
            itemId: 198963, // Decaying Phlegm
            questId: 70504,
            source: 'Mobs: Decay',
        },
        {
            itemId: 198964, // Elementious Splinter
            questId: 70511,
            source: 'Mobs: Elemental',
        },
        {
            itemId: 204226, // Blazehoof Ashes
            questId: 74331,
            source: 'FR: Agni Blazehoof',
        },
    ],
}
