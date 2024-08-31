import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinSkinning: TaskProfession = {
    id: Profession.Skinning,
    subProfessionId: 2882,
    hasTasks: true,
    bookQuests: [
        {
            itemId: 227417, // Faded Skinner's Notes
            questId: 84232,
            source: 'AC',
        },
        {
            itemId: 227428, // Exceptional Skinner's Notes
            questId: 84233,
            source: 'AC',
        },
        {
            itemId: 227439, // Pristine Skinner's Notes
            questId: 84234,
            source: 'AC',
        },
    ],
    dropQuests: [
        {
            itemId: 224780, // Toughened Tempest Pelt
            questId: 81459,
            source: 'Gathering',
        },
        {
            itemId: 224780, // Toughened Tempest Pelt
            questId: 81460,
            source: 'Gathering',
        },
        {
            itemId: 224780, // Toughened Tempest Pelt
            questId: 81461,
            source: 'Gathering',
        },
        {
            itemId: 224780, // Toughened Tempest Pelt
            questId: 81462,
            source: 'Gathering',
        },
        {
            itemId: 224780, // Toughened Tempest Pelt
            questId: 81463,
            source: 'Gathering',
        },
        {
            itemId: 224781, // Abyssal Fur
            questId: 81464,
            source: 'Gathering',
        },
    ],
    treasureQuests: [],
};

export const dragonflightSkinning: TaskProfession = {
    id: Profession.Skinning,
    subProfessionId: 2834,
    masterQuestId: 70259,
    bookQuests: [
        {
            itemId: 200982, // Artisan's Consortium, Preferred
            questId: 71902,
            source: 'AC 2',
        },
        {
            itemId: 201278, // Artisan's Consortium, Valued
            questId: 71913,
            source: 'AC 4',
        },
        {
            itemId: 201289, // Artisan's Consortium, Esteemed
            questId: 71924,
            source: 'AC 5',
        },
        {
            itemId: 201714, // Notebook of Crafting Knowledge
            questId: 72322, // Iskaaran Crafter's Knowledge
            source: 'IT 14',
        },
        {
            itemId: 201718, // Notebook of Crafting Knowledge
            points: 10,
            questId: 72327, // Iskaaran Crafting Mastery
            source: 'IT 24',
        },
        {
            itemId: 201714, // Notebook of Crafting Knowledge
            questId: 72310, // A Gift of Knowledge
            source: 'MC 14',
        },
        {
            itemId: 201718, // Notebook of Crafting Knowledge
            points: 10,
            questId: 72317, // A Gift of Secrets
            source: 'MC 24',
        },
        {
            itemId: 205357, // Niffen Notebook of Skinning Knowledge
            questId: 75760,
            source: 'LN',
        },
        {
            itemId: 205444, // Bartered Skinning Journal
            questId: 75857,
            source: 'ZCB',
        },
        {
            itemId: 205433, // Bartered Skinning Notes
            questId: 75838,
            source: 'ZCB',
        },
    ],
};
