import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinHerbalism: TaskProfession = {
    id: Profession.Herbalism,
    subProfessionId: 2877,
    bookQuests: [],
    dropQuests: [],
    treasureQuests: [],
};

export const dragonflightHerbalism: TaskProfession = {
    id: Profession.Herbalism,
    subProfessionId: 2832,
    masterQuestId: 70253,
    bookQuests: [
        {
            itemId: 200980, // Artisan's Consortium, Preferred
            questId: 71897,
            source: 'AC 2',
        },
        {
            itemId: 201276, // Artisan's Consortium, Valued
            questId: 71908,
            source: 'AC 4',
        },
        {
            itemId: 201287, // Artisan's Consortium, Esteemed
            questId: 71919,
            source: 'AC 5',
        },
        {
            itemId: 201705, // Notebook of Crafting Knowledge
            questId: 72319, // Iskaaran Crafter's Knowledge
            source: 'IT 14',
        },
        {
            itemId: 201717, // Notebook of Crafting Knowledge
            points: 10,
            questId: 72324, // Iskaaran Crafting Mastery
            source: 'IT 24',
        },
        {
            itemId: 201705, // Notebook of Crafting Knowledge
            questId: 72313, // A Gift of Knowledge
            source: 'MC 14',
        },
        {
            itemId: 201717, // Notebook of Crafting Knowledge
            points: 10,
            questId: 72316, // A Gift of Secrets
            source: 'MC 24',
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
};
