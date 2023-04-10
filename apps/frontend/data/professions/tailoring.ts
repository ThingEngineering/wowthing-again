import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightTailoring: DragonflightProfession = {
    id: Profession.Tailoring,
    hasCraft: true,
    hasOrders: true,
    masterQuestId: 70260,
    bookQuests: [
        {
            itemId: 200975, // Artisan's Consortium, Preferred
            questId: 71903,
        },
        {
            itemId: 201271, // Artisan's Consortium, Valued
            questId: 71914,
        },
        {
            itemId: 201282, // Artisan's Consortium, Esteemed
            questId: 71925,
        },
    ],
    dropQuests: [
        {
            itemId: 193898, // Umbral Bone Needle
            questId: 66386,
            source: 'Treasures',
        },
        {
            itemId: 193899, // Primalweave Spindle
            questId: 66387,
            source: 'Treasures',
        },
        {
            itemId: 198977, // Ohn'ahran Weave
            questId: 70524,
            source: 'Mobs: Centaur',
        },
        {
            itemId: 198978, // Stupidly Effective Stitchery
            questId: 70525,
            source: 'Mobs: Gnoll',
        },
        {
            itemId: 204225, // Perfect Windfeather
            questId: 74321,
            source: 'FR: Gareed',
        },
    ],
}
