import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinHerbalism: TaskProfession = {
    id: Profession.Herbalism,
    subProfessionId: 2877,
    hasTasks: true,
    bookQuests: [
        {
            itemId: 227415, // Faded Herbalist's Notes
            questId: 81422,
            source: 'AC',
            costs: [{ amount: 200, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227426, // Exceptional Herbalist's Notes
            questId: 81423,
            source: 'AC',
            costs: [{ amount: 300, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227437, // Pristine Herbalist's Notes
            questId: 81424,
            source: 'AC',
            costs: [{ amount: 400, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224656, // Void-Lit Herbalism Notes
            questId: 83066,
            source: 'HA 14',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224023, // Herbal Embalming Techniques
            questId: 82630,
            source: 'CoT',
            costs: [{ amount: 565, currencyId: 3056 }], // Kej
        },
        {
            itemId: 232503, // Undermine Treatise on Herbalism
            questId: 85738,
            source: 'UM 16',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 235865, // Ethereal Tome of Herbalism Knowledge
            questId: 87263,
            source: 'TV 12',
            costs: [{ amount: 75, itemId: 210814 }], // Artisan's Acuity
        },
    ],
    dropQuests: [
        {
            itemId: 224264, // Deepgrove Rose Petal
            questId: 81416,
            source: 'Gathering',
        },
        {
            itemId: 224264, // Deepgrove Rose Petal
            questId: 81417,
            source: 'Gathering',
        },
        {
            itemId: 224264, // Deepgrove Rose Petal
            questId: 81418,
            source: 'Gathering',
        },
        {
            itemId: 224264, // Deepgrove Rose Petal
            questId: 81419,
            source: 'Gathering',
        },
        {
            itemId: 224264, // Deepgrove Rose Petal
            questId: 81420,
            source: 'Gathering',
        },
        {
            itemId: 224265, // Deepgrove Rose
            questId: 81421,
            source: 'Gathering',
        },
    ],
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
