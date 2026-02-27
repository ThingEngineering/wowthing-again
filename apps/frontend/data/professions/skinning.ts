import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

const midnightTaskQuests = [
    93710, // Tempered in Darkness
    93711, // The Chill of the Void
    93712, // ??
    93713, // ??
    93714, // Minor Scales
];

export const midnightSkinning: TaskProfession = {
    id: Profession.Skinning,
    subProfessionId: 2917,
    treatiseQuest: {
        itemId: 245828, // Thalassian Treatise on Skinning
        questId: 95136,
    },
    taskQuests: midnightTaskQuests.map((questId) => ({
        itemId: 263461, // Thalassian Skinner's Notes
        questId,
    })),
    bookQuests: [
        {
            itemId: 250445, // Echo of Abundance: Skinning
            questId: 92188,
            source: '???',
        },
        {
            itemId: 250923, // Whisper of the Loa: Skinning
            questId: 92373,
            source: 'AT 6',
        },
    ],
};

const taskQuestIds = [
    82992, // Stormcharged Goods
    82993, // From Shadows
    83097, // Cinder and Storm
    83098, // Snap and Crackle
    83100, // Cracking the Shell
];

export const warWithinSkinning: TaskProfession = {
    id: Profession.Skinning,
    subProfessionId: 2882,
    treatiseQuest: {
        itemId: 222649, // Algari Treatise on Skinning
        questId: 83734,
    },
    taskQuests: taskQuestIds.map((questId) => ({
        itemId: 224807, // Algari Skinner's Notes
        questId,
    })),
    gatherQuests: [
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
    bookQuests: [
        {
            itemId: 227417, // Faded Skinner's Notes
            questId: 84232,
            source: 'AC',
            costs: [{ amount: 200, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227428, // Exceptional Skinner's Notes
            questId: 84233,
            source: 'AC',
            costs: [{ amount: 300, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227439, // Pristine Skinner's Notes
            questId: 84234,
            source: 'AC',
            costs: [{ amount: 400, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224657, // Void-Lit Skinning Notes
            questId: 83067,
            source: 'HA 14',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224007, // Uses for Leftover Husks (How to Take Them Apart)
            questId: 82596,
            source: 'CoT',
            costs: [{ amount: 565, currencyId: 3056 }], // Kej
        },
        {
            itemId: 232506, // Undermine Treatise on Skinning
            questId: 85744,
            source: 'UM 16',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 235856, // Ethereal Tome of Skinning Knowledge
            questId: 87258,
            source: 'TV 12',
            costs: [{ amount: 75, itemId: 210814 }], // Artisan's Acuity
        },
    ],
    treasureQuests: [],
};

const curiousHideScrapsItemId = 198837;
const skinningFieldNotesQuest = (questId: number) => ({
    itemId: 199128,
    questId,
});
const dragonflightProvideQuests = [
    70619, // A Study of Leather
    70620, // Scaling Up
    72158, // A Dense Delivery
    72159, // Scaling Down
];

export const dragonflightSkinning: TaskProfession = {
    id: Profession.Skinning,
    subProfessionId: 2834,
    masterQuestId: 70259,
    treatiseQuest: {
        itemId: 201023, // Draconic Treatise on Skinning
        questId: 74114,
    },
    provideQuests: dragonflightProvideQuests.map(skinningFieldNotesQuest),
    gatherQuests: [
        {
            itemId: curiousHideScrapsItemId,
            questId: 70381,
        },
        {
            itemId: curiousHideScrapsItemId,
            questId: 70383,
        },
        {
            itemId: curiousHideScrapsItemId,
            questId: 70384,
        },
        {
            itemId: curiousHideScrapsItemId,
            questId: 70385,
        },
        {
            itemId: curiousHideScrapsItemId,
            questId: 70386,
        },
        {
            itemId: 198841, // Large Sample of Curious Hide
            questId: 70389,
        },
    ],
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
