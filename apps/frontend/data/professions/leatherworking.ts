import { Profession } from '@/enums/profession'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightLeatherworking: DragonflightProfession = {
    id: Profession.Leatherworking,
    subProfessionId: 2830,
    hasTask: true,
    hasOrders: true,
    masterQuestId: 70256,
    bookQuests: [
        {
            itemId: 200979, // Artisan's Consortium, Preferred
            questId: 71900,
            source: 'AC 2',
        },
        {
            itemId: 201275, // Artisan's Consortium, Valued
            questId: 71911,
            source: 'AC 4',
        },
        {
            itemId: 201286, // Artisan's Consortium, Esteemed
            questId: 71922,
            source: 'AC 5',
        },
        {
            itemId: 201713, // Notebook of Crafting Knowledge
            questId: 72321, // Iskaaran Crafter's Knowledge
            source: 'IT 14',
        },
        {
            itemId: 201713, // Notebook of Crafting Knowledge
            questId: 72326, // Iskaaran Crafting Mastery
            source: 'IT 24',
        },
        {
            itemId: 201713, // Notebook of Crafting Knowledge
            questId: 72296, // A Gift of Knowledge
            source: 'MC 14',
        },
        {
            itemId: 201713, // Notebook of Crafting Knowledge
            questId: 72297, // A Gift of Secrets
            source: 'MC 24',
        },
        {
            itemId: 205350, // Niffen Notebook of Leatherworking Knowledge
            questId: 75751,
            source: 'LN',
        },
        {
            itemId: 205437, // Bartered Leatherworking Journal
            questId: 75855,
            source: 'ZCB',
        },
        {
            itemId: 205426, // Bartered Leatherworking Notes
            questId: 75840,
            source: 'ZCB',
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
        {
            itemId: 204232, // Slyvern Alpha Claw
            questId: 74307,
            source: 'FR: Snarfang',
        },
    ],
    treasureQuests: [
        {
            itemId: 198690, // Bag of Decayed Scales
            questId: 70294,
            source: 'TD',
        },
        {
            itemId: 198683, // Treated Hides
            questId: 70286,
            source: 'AS',
        },
        {
            itemId: 198658, // Decay-Infused Tanning Oil
            questId: 70266,
            source: 'AS',
        },
        {
            itemId: 204986, // Flame-Infused Scale Oil
            questId: 75495,
            source: 'ZC',
        },
        {
            itemId: 204987, // Lava-Forged Leatherworker's "Knife"
            questId: 75496,
            source: 'ZC',
        },
        {
            itemId: 198711, // Poacher's Pack
            questId: 70308,
            source: 'WS',
        },
        {
            itemId: 198667, // Spare Djaradin Tools
            questId: 70280,
            source: 'WS',
        },
        {
            itemId: 204988, // Sulfur-Soaked Skins
            questId: 75502,
            source: 'ZC',
        },
        {
            itemId: 201018, // Well-Danced Drum
            questId: 70269,
            source: 'AS',
        },
        {
            itemId: 198696, // Wind-Blessed Hide
            questId: 70300,
            source: 'OP',
        },
        {
            itemId: 210215, // Dreamtalon Claw
            questId: 78305,
            source: 'ED',
        },
        {
            itemId: 210211, // Molted Faerie Dragon Scales
            questId: 78299,
            source: 'ED',
        },
        {
            itemId: 210208, // Tuft of Dreamsaber Fur
            questId: 78298,
            source: 'ED',
        },
    ]
}
