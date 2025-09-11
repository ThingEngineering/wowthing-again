import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinAlchemy: TaskProfession = {
    id: Profession.Alchemy,
    subProfessionId: 2871,
    orderQuest: {
        itemId: 228773, // Algari Alchemist's Notebook
        questId: 84133,
    },
    treatiseQuest: {
        itemId: 222546, // Algari Treatise on Alchemy
        questId: 83725,
    },
    dropQuests: [
        {
            itemId: 225234, // Alchemical Sediment
            questId: 83253,
            source: 'Mobs/Treasures',
        },
        {
            itemId: 225235, // Deepstone Crucible
            questId: 83255,
            source: 'Mobs/Treasures',
        },
    ],
    bookQuests: [
        {
            itemId: 227409, // Faded Alchemist's Research
            questId: 81146,
            source: 'AC',
            costs: [{ amount: 200, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227420, // Exceptional Alchemist's Research
            questId: 81147,
            source: 'AC',
            costs: [{ amount: 300, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227431, // Pristine Alchemist's Research
            questId: 81148,
            source: 'AC',
            costs: [{ amount: 400, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224645, // Jewel-Etched Alchemy Notes
            questId: 83058,
            source: 'CoD 12',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224024, // Theories of Bodily Transmutation, Chapter 8
            questId: 82633,
            source: 'CoT',
            costs: [{ amount: 565, currencyId: 3056 }], // Kej
        },
        {
            itemId: 232499, // Undermine Treatise on Alchemy
            questId: 85734,
            source: 'UM 16',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 235865, // Ethereal Tome of Alchemy Knowledge
            questId: 87255,
            source: 'TV 12',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
    ],
    treasureQuests: [],
};

const alchemyNotesQuest = (questId: number) => ({
    itemId: 198608,
    questId,
});
const dragonflightProvideQuests = [
    70530, // Examination Week
    70531, // Mana Markets
    70532, // Aiding the Raiding
    70533, // Draught, Oiled Again
];
const dragonflightTaskQuests = [
    66937, // Decaying News
    66938, // Mammoth Marrow
    66940, // Elixir Experiment
    72427, // Animated Infusion
    75363, // [ZC] Deepflayer Dust
    75371, // [ZC] Fascinating Fungi
    77932, // [ED] Warmth of Life
    77933, // [ED] Bubbling Discoveries
];

export const dragonflightAlchemy: TaskProfession = {
    id: Profession.Alchemy,
    subProfessionId: 2823,
    masterQuestId: 70247,
    treatiseQuest: {
        itemId: 194697, // Draconic Treatise on Alchemy
        questId: 74108,
    },
    provideQuests: dragonflightProvideQuests.map(alchemyNotesQuest),
    taskQuests: dragonflightTaskQuests.map(alchemyNotesQuest),
    dropQuests: [
        {
            itemId: 193891, // Experimental Substance
            questId: 66373,
            source: 'Treasures',
        },
        {
            itemId: 193897, // Reawakened Catalyst
            questId: 66374,
            source: 'Treasures',
        },
        {
            itemId: 198963, // Decaying Phlegm
            questId: 70504,
            source: 'Mobs: Decay',
        },
        {
            itemId: 198964, // Elementious Splinter
            questId: 70511,
            source: 'Mobs: Elemental',
        },
        {
            itemId: 204226, // Blazehoof Ashes
            questId: 74331,
            source: 'FR: Agni Blazehoof',
        },
    ],
    bookQuests: [
        {
            itemId: 200974, // Artisan's Consortium, Preferred
            questId: 71893,
            source: 'AC 2',
        },
        {
            itemId: 201270, // Artisan's Consortium, Valued
            questId: 71904,
            source: 'AC 4',
        },
        {
            itemId: 201281, // Artisan's Consortium, Esteemed
            questId: 71915,
            source: 'AC 5',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 72311, // A Gift of Knowledge
            source: 'MC 14',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 72314, // A Gift of Secrets
            source: 'MC 24',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 70892, // Crafting Your Start
            source: 'VA 14',
        },
        {
            itemId: 201706, // Notebook of Crafting Knowledge
            questId: 70889, // Crafting for Expertise
            source: 'VA 24',
        },
        {
            itemId: 205353, // Niffen Notebook of Alchemy Knowledge
            questId: 75756,
            source: 'LN',
        },
        {
            itemId: 205440, // Bartered Alchemy Journal
            questId: 75848,
            source: 'ZCB',
        },
        {
            itemId: 205429, // Bartered Alchemy Notes
            questId: 75847,
            source: 'ZCB',
        },
    ],
    treasureQuests: [
        {
            itemId: 198710, // Canteen of Suspicious Water
            questId: 70305,
            source: 'OP',
        },
        {
            itemId: 198697, // Contraband Concoction
            questId: 70301,
            source: 'TD',
        },
        {
            itemId: 198599, // Experimental Decay Sample
            questId: 70208,
            source: 'AS',
        },
        {
            itemId: 198663, // Frostforged Potion
            questId: 70274,
            source: 'WS',
        },
        {
            itemId: 205212, // Marrow-Ripened Slime
            questId: 75649,
            source: 'ZC',
        },
        {
            itemId: 205211, // Nutrient Diluted Protofluid
            questId: 75646,
            source: 'ZC',
        },
        {
            itemId: 198712, // Small Basket of Firewater Powder
            questId: 70309,
            source: 'AS',
        },
        {
            itemId: 205213, // Suspicious Mold
            questId: 75651,
            source: 'ZC',
        },
        {
            itemId: 203471, // Tasty Candy
            questId: 70278,
            source: 'TD',
        },
        {
            itemId: 198685, // Well Insulated Mug
            questId: 70289,
            source: 'WS',
        },
        {
            itemId: 210190, // Blazeroot
            questId: 78275,
            source: 'ED',
        },
        {
            itemId: 210184, // Half-Filled Dreamless Sleep Potion
            questId: 78264,
            source: 'ED',
        },
        {
            itemId: 210185, // Splash Potion of Narcolepsy
            questId: 78269,
            source: 'ED',
        },
    ],
};
