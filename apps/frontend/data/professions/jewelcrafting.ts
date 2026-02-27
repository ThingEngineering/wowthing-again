import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const midnightJewelcrafting: TaskProfession = {
    id: Profession.Jewelcrafting,
    subProfessionId: 2914,
    orderQuest: {
        itemId: 263458, // Thalassian Jewelcrafter's Notebook
        questId: 93694,
    },
    treatiseQuest: {
        itemId: 245760, // Thalassian Treatise on Jewelcrafting
        questId: 95133,
    },
    bookQuests: [
        {
            itemId: 257599, // Skill Issue: Jewelcrafting
            questId: 93222,
            source: 'SC 6',
        },
    ],
};

export const warWithinJewelcrafting: TaskProfession = {
    id: Profession.Jewelcrafting,
    subProfessionId: 2879,
    orderQuest: {
        itemId: 228777, // Algari Jewelcrafter's Notebook
        questId: 84130,
    },
    treatiseQuest: {
        itemId: 222551, // Algari Treatise on Jewelcrafting
        questId: 83731,
    },
    dropQuests: [
        {
            itemId: 225225, // Deepstone Fragment
            questId: 83266,
            source: 'Mobs/Treasures',
        },
        {
            itemId: 225224, // Diaphanous Gem Shards
            questId: 83265,
            source: 'Mobs/Treasures',
        },
    ],
    bookQuests: [
        {
            itemId: 227413, // Faded Jeweler's Illustrations
            questId: 81259,
            source: 'AC',
            costs: [{ amount: 200, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227424, // Exceptional Jeweler's Illustrations
            questId: 81260,
            source: 'AC',
            costs: [{ amount: 300, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227435, // Pristine Jeweler's Illustrations
            questId: 81261,
            source: 'AC',
            costs: [{ amount: 400, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224655, // Void-Lit Jewelcrafting Notes
            questId: 83065,
            source: 'HA 14',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224054, // Emergent Crystals of the Surface-Dwellers
            questId: 82637,
            source: 'CoT',
            costs: [{ amount: 565, currencyId: 3056 }], // Kej
        },
        {
            itemId: 232504, // Undermine Treatise on Jewelcrafting
            questId: 85740,
            source: 'UM 16',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 235859, // Ethereal Tome of Alchemy Knowledge
            questId: 87261,
            source: 'TV 12',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
    ],
    treasureQuests: [],
};

const jewelersCutsQuest = (questId: number) => ({
    itemId: 198612,
    questId,
});
const dragonflightProvideQuests = [
    70562, // The Plumbers, Mason
    70563, // The Exhibition
    70564, // Spectacular
    70565, // Separation by Saturation
];
const dragonflightTaskQuests = [
    66516, // Mundane Gems, I Think Not!
    66949, // Trinket Bandits
    66950, // Heart of a Giant
    72428, // Hornswog Hoarders
    75362, // [ZC] Cephalo-crystalization
    75602, // [ZC] Chips off the Old Crystal Block
    77892, // [ED] Pearls of Great Value
    77912, // [ED] Unmodern Jewelry
];

export const dragonflightJewelcrafting: TaskProfession = {
    id: Profession.Jewelcrafting,
    subProfessionId: 2829,
    masterQuestId: 70255,
    orderQuest: jewelersCutsQuest(70593),
    treatiseQuest: {
        itemId: 194703, // Draconic Treatise on Jewelcrafting
        questId: 74112,
    },
    provideQuests: dragonflightProvideQuests.map(jewelersCutsQuest),
    taskQuests: dragonflightTaskQuests.map(jewelersCutsQuest),
    dropQuests: [
        {
            itemId: 193909, // Ancient Gem Fragments
            questId: 66388,
            source: 'Treasures',
        },
        {
            itemId: 193907, // Chipped Tyrstone
            questId: 66389,
            source: 'Treasures',
        },
        {
            itemId: 198973, // Incandescent Curio
            questId: 70520,
            source: 'Mobs: Elemental',
        },
        {
            itemId: 198974, // Elegantly Engrabed Embellishment
            questId: 70521,
            source: 'Mobs: Dragonkin',
        },
        {
            itemId: 204222, // Conductive Ametrine Shard
            questId: 74333,
            source: 'FR: Amephyst',
        },
    ],
    bookQuests: [
        {
            itemId: 200978, // Artisan's Consortium, Preferred
            questId: 71899,
            source: 'AC 2',
        },
        {
            itemId: 201274, // Artisan's Consortium, Valued
            questId: 71910,
            source: 'AC 4',
        },
        {
            itemId: 201285, // Artisan's Consortium, Esteemed
            questId: 71921,
            source: 'AC 5',
        },
        {
            itemId: 201712, // Notebook of Crafting Knowledge
            questId: 72301, // Expedition Crafting Knowledge
            source: 'DE 14',
        },
        {
            itemId: 201712, // Notebook of Crafting Knowledge
            questId: 72306, // Expedition Crafting Knowledge
            source: 'DE 23',
        },
        {
            itemId: 201712, // Notebook of Crafting Knowledge
            questId: 72320, // Iskaaran Crafter's Knowledge
            source: 'IT 14',
        },
        {
            itemId: 201712, // Notebook of Crafting Knowledge
            questId: 72325, // Iskaaran Crafting Mastery
            source: 'IT 24',
        },
        {
            itemId: 205348, // Niffen Notebook of Jewelcrafting Knowledge
            questId: 75754,
            source: 'LN',
        },
        {
            itemId: 205435, // Bartered Jewelcrafting Journal
            questId: 75854,
            source: 'ZCB',
        },
        {
            itemId: 205424, // Bartered Jewelcrafting Notes
            questId: 75841,
            source: 'ZCB',
        },
    ],
    treasureQuests: [
        {
            itemId: 198682, // Alexstraszite Cluster
            questId: 70285,
            source: 'TD',
        },
        {
            itemId: 205219, // Broken Barter Boulder
            questId: 75654,
            source: 'ZC',
        },
        {
            itemId: 198687, // Closely Guarded Shiny
            questId: 70292,
            source: 'WS',
        },
        {
            itemId: 198664, // Crystalline Overgrowth
            questId: 70277,
            source: 'AS',
        },
        {
            itemId: 198657, // Fragmented Key
            questId: 70263,
            source: 'OP',
        },
        {
            itemId: 205216, // Gently Jostled Jewels
            questId: 75653,
            source: 'ZC',
        },
        {
            itemId: 201016, // Harmonic Crystal Harmonizer
            questId: 70271,
            source: 'AS',
        },
        {
            itemId: 201017, // Igneous Gem
            questId: 70273,
            source: 'WS',
        },
        {
            itemId: 198670, // Lofty Malygite
            questId: 70282,
            source: 'OP',
        },
        {
            itemId: 198656, // Painter's Pretty Jewel
            questId: 70261,
            source: 'TD',
        },
        {
            itemId: 205214, // Snubbed Snail Shells
            questId: 75652,
            source: 'ZC',
        },
        {
            itemId: 210202, // Coalesced Dreamstone
            questId: 78285,
            source: 'ED',
        },
        {
            itemId: 210201, // Handful of Pebbles
            questId: 78283,
            source: 'ED',
        },
        {
            itemId: 210200, // Petrified Hope
            questId: 78282,
            source: 'ED',
        },
    ],
};
