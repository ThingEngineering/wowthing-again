import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

const midnightTaskQuests = [
    93705, // Copper for Your Thoughts?
    93706, // Aggressive Tin-dencies
    93707, // ??
    93708, // Conductive Metals
    93709, // Stocking the Staples
];

export const midnightMining: TaskProfession = {
    id: Profession.Mining,
    subProfessionId: 2916,
    treatiseQuest: {
        itemId: 245762, // Thalassian Treatise on Mining
        questId: 95135,
    },
    taskQuests: midnightTaskQuests.map((questId) => ({
        itemId: 263463, // Thalassian Miner's Notes
        questId,
    })),
    bookQuests: [
        {
            itemId: 250444, // Echo of Abundance: Mining
            questId: 92187,
            source: '???',
        },
        {
            itemId: 250924, // Whisper of the Loa: Leatherworking
            questId: 92372,
            source: 'AT 6',
        },
    ],
};

const warWithinTaskQuests = [
    83102, // Bismuth is Business
    83103, // Acquiring Aqirite
    83104, // Identifying Ironclaw
    83105, // Rush-order Requisition
    83106, // Null Pebble Excavation
];

export const warWithinMining: TaskProfession = {
    id: Profession.Mining,
    subProfessionId: 2881,
    treatiseQuest: {
        itemId: 222553, // Algari Treatise on Mining
        questId: 83733,
    },
    taskQuests: warWithinTaskQuests.map((questId) => ({
        itemId: 224818, // Algari Miner's Notes
        questId,
    })),
    gatherQuests: [
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
    bookQuests: [
        {
            itemId: 227416, // Faded Miner's Notes
            questId: 81390,
            source: 'AC',
            costs: [{ amount: 200, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227427, // Exceptional Miner's Notes
            questId: 81391,
            source: 'AC',
            costs: [{ amount: 300, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227438, // Pristine Miner's Notes
            questId: 81392,
            source: 'AC',
            costs: [{ amount: 400, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224651, // Machine-Learned Mining Notes
            questId: 83062,
            source: 'AotD 12',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224055, // A Rocky Start
            questId: 82614,
            source: 'CoT',
            costs: [{ amount: 565, currencyId: 3056 }], // Kej
        },
        {
            itemId: 232509, // Undermine Treatise on Mining
            questId: 85742,
            source: 'UM 16',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 235857, // Ethereal Tome of Mining Knowledge
            questId: 87259,
            source: 'TV 12',
            costs: [{ amount: 75, itemId: 210814 }], // Artisan's Acuity
        },
    ],
    treasureQuests: [],
};

const iridescentOreFragmentsItemId = 201300;
const miningFieldNotesQuest = (questId: number) => ({
    itemId: 199122,
    questId,
});
const dragonflightProvideQuests = [
    70617, // All Mine, Mine, Mine
    70618, // The Call of the Forge
    72156, // A Fiery Fight
    72157, // The Weight of Earth
];

export const dragonflightMining: TaskProfession = {
    id: Profession.Mining,
    subProfessionId: 2833,
    masterQuestId: 70258,
    treatiseQuest: {
        itemId: 194708, // Draconic Treatise on Mining
        questId: 74106,
    },
    provideQuests: dragonflightProvideQuests.map(miningFieldNotesQuest),
    gatherQuests: [
        {
            itemId: iridescentOreFragmentsItemId,
            questId: 72160,
        },
        {
            itemId: iridescentOreFragmentsItemId,
            questId: 72161,
        },
        {
            itemId: iridescentOreFragmentsItemId,
            questId: 72162,
        },
        {
            itemId: iridescentOreFragmentsItemId,
            questId: 72163,
        },
        {
            itemId: iridescentOreFragmentsItemId,
            questId: 72164,
        },
        {
            itemId: 198841, // Large Sample of Curious Hide
            questId: 72165,
        },
    ],
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
