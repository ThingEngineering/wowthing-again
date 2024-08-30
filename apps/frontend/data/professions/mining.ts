import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinMining: TaskProfession = {
    id: Profession.Mining,
    subProfessionId: 2881,
    hasTasks: true,
    bookQuests: [],
    dropQuests: [
        {
            itemId: 224583, // Slab of Slate
            questId: 83054,
            source: 'Gathering',
        },
        {
            itemId: 224583, // Slab of Slate
            questId: 83053,
            source: 'Gathering',
        },
        {
            itemId: 224583, // Slab of Slate
            questId: 83052,
            source: 'Gathering',
        },
        {
            itemId: 224583, // Slab of Slate
            questId: 83051,
            source: 'Gathering',
        },
        {
            itemId: 224583, // Slab of Slate
            questId: 83050,
            source: 'Gathering',
        },
        {
            itemId: 224584, // Erosion Polished Slate
            questId: 83049,
            source: 'Gathering',
        },
    ],
    treasureQuests: [],
};

export const dragonflightMining: TaskProfession = {
    id: Profession.Mining,
    subProfessionId: 2833,
    masterQuestId: 70258,
    bookQuests: [
        {
            itemId: 200981, // Artisan's Consortium, Preferred
            questId: 71901,
            source: 'AC 2',
        },
        {
            itemId: 201277, // Artisan's Consortium, Valued
            questId: 71912,
            source: 'AC 4',
        },
        {
            itemId: 201288, // Artisan's Consortium, Esteemed
            questId: 71923,
            source: 'AC 5',
        },
        {
            itemId: 201700, // Notebook of Crafting Knowledge
            questId: 72302, // Expedition Crafting Knowledge
            source: 'DE 14',
        },
        {
            itemId: 201716, // Notebook of Crafting Knowledge
            points: 10,
            questId: 72308, // Expedition Crafting Knowledge
            source: 'DE 23',
        },
        {
            itemId: 201700, // Notebook of Crafting Knowledge
            questId: 72332, // Crafting Your Start
            source: 'VA 14',
        },
        {
            itemId: 201716, // Notebook of Crafting Knowledge
            points: 10,
            questId: 72335, // Crafting for Expertise
            source: 'VA 24',
        },
        {
            itemId: 205356, // Niffen Notebook of Mining Knowledge
            questId: 75758,
            source: 'LN',
        },
        {
            itemId: 205443, // Bartered Mining Journal
            questId: 75856,
            source: 'ZCB',
        },
        {
            itemId: 205432, // Bartered Mining Notes
            questId: 75839,
            source: 'ZCB',
        },
    ],
};
