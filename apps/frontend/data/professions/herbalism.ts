import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

const midnightTaskQuests = [
    93700, // Experience Tranquility
    93701, // ??
    93702, // The Root of Life
    93703, // Sin'dorei Vices
    93704, // Traditional Harvests
];

export const midnightHerbalism: TaskProfession = {
    id: Profession.Herbalism,
    subProfessionId: 2912,
    treatiseQuest: {
        itemId: 245761, // Thalassian Treatise on Herbalism
        questId: 95130,
    },
    taskQuests: midnightTaskQuests.map((questId) => ({
        itemId: 263462, // Thalassian Herbalist's Notes
        questId,
    })),
    bookQuests: [
        {
            itemId: 250443, // Echo of Abundance: Herbalism
            questId: 92174,
            source: '???',
        },
        {
            itemId: 258410, // Traditions of the Hara'nir: Herbalism
            questId: 93411,
            source: 'HN 6',
        },
    ],
};

const taskQuestIds = [
    82916, // When Fungi Bloom
    82958, // Little Blessings
    82962, // A Handful of Luredrops
    82965, // Light and Shadow
    82970, // A Bloom and A Blossom
];

export const warWithinHerbalism: TaskProfession = {
    id: Profession.Herbalism,
    subProfessionId: 2877,
    taskQuests: taskQuestIds.map((questId) => ({
        itemId: 224817, // Algari Herbalist's Notes
        questId,
    })),
    gatherQuests: [
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
    treatiseQuest: {
        itemId: 222552, // Algari Treatise on Herbalism
        questId: 83729,
    },
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
    treasureQuests: [],
};

const dreambloomPetalItemId = 200677;
const herbalismFieldNotesQuest = (questId: number) => ({
    itemId: 199115,
    questId,
});
const dragonflightProvideQuests = [
    70613, // Get Their Bark Before They Bite
    70614, // Bubble Craze
    70615, // The Case of the Missing Herbs
    70616, // How Many??
];

export const dragonflightHerbalism: TaskProfession = {
    id: Profession.Herbalism,
    subProfessionId: 2832,
    masterQuestId: 70253,
    treatiseQuest: {
        itemId: 194704, // Draconic Treatise on Herbalism
        questId: 74107,
    },
    provideQuests: dragonflightProvideQuests.map(herbalismFieldNotesQuest),
    gatherQuests: [
        {
            itemId: dreambloomPetalItemId,
            questId: 71857,
        },
        {
            itemId: dreambloomPetalItemId,
            questId: 71858,
        },
        {
            itemId: dreambloomPetalItemId,
            questId: 71859,
        },
        {
            itemId: dreambloomPetalItemId,
            questId: 71860,
        },
        {
            itemId: dreambloomPetalItemId,
            questId: 71861,
        },
        {
            itemId: 200678, // Dreambloom
            questId: 71864,
        },
    ],
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
