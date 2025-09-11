import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinTailoring: TaskProfession = {
    id: Profession.Tailoring,
    subProfessionId: 2883,
    orderQuest: {
        itemId: 228779, // Algari Tailor's Notebook
        questId: 84132,
        source: 'Work Orders',
    },
    treatiseQuest: {
        itemId: 222547, // Algari Treatise on Tailoring
        questId: 83735,
    },
    dropQuests: [
        {
            itemId: 225220, // Chitin Needle
            questId: 83270,
            source: 'Mobs/Treasures',
        },
        {
            itemId: 225221, // Spool of Webweave
            questId: 83269,
            source: 'Mobs/Treasures',
        },
    ],
    bookQuests: [
        {
            itemId: 227410, // Faded Tailor's Diagrams
            questId: 80871,
            source: 'AC',
            costs: [{ amount: 200, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227421, // Exceptional Tailor's Diagrams
            questId: 80872,
            source: 'AC',
            costs: [{ amount: 300, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227432, // Pristine Tailor's Diagrams
            questId: 80873,
            source: 'AC',
            costs: [{ amount: 400, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224648, // Jewel-Etched Tailoring Notes
            questId: 83061,
            source: 'CoD 12',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224036, // And That's A Web-Wrap!
            questId: 82634,
            source: 'CoT',
            costs: [{ amount: 565, currencyId: 3056 }], // Kej
        },
        {
            itemId: 232502, // Undermine Treatise on Tailoring
            questId: 85745,
            source: 'UM 16',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 235855, // Ethereal Tome of Tailoring Knowledge
            questId: 87257,
            source: 'TV 12',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
    ],
    treasureQuests: [],
};

const tailoringExamplesQuest = (questId: number) => ({
    itemId: 198609,
    questId,
});
const dragonflightProvideQuests = [
    70572, // The Cold Does Bother Them, Actually
    70582, // Weave Well Enough Alone
    70586, // Sew Many Cooks
    70587, // A Knapsack Problem
];
const dragonflightTaskQuests = [
    66899, // Fuzzy Legs
    66952, // The Gnoll's Clothes
    66953, // All Things Fluffy
    72410, // Pincers and Needles
    75407, // [ZC] Silk Scavenging
    75600, // [ZC] Silk's Silk
    77947, // [ED] Primalist Fashion
    77949, // [ED] Fashion Feathers
];

export const dragonflightTailoring: TaskProfession = {
    id: Profession.Tailoring,
    subProfessionId: 2831,
    masterQuestId: 70260,
    orderQuest: tailoringExamplesQuest(70594),
    treatiseQuest: {
        itemId: 194698, // Draconic Treatise on Tailoring
        questId: 74115,
    },
    provideQuests: dragonflightProvideQuests.map(tailoringExamplesQuest),
    taskQuests: dragonflightTaskQuests.map(tailoringExamplesQuest),
    dropQuests: [
        {
            itemId: 193898, // Umbral Bone Needle
            questId: 66386,
            source: 'Treasures',
        },
        {
            itemId: 193899, // Primalweave Spindle
            questId: 66387,
            source: 'Treasures',
        },
        {
            itemId: 198977, // Ohn'ahran Weave
            questId: 70524,
            source: 'Mobs: Centaur',
        },
        {
            itemId: 198978, // Stupidly Effective Stitchery
            questId: 70525,
            source: 'Mobs: Gnoll',
        },
        {
            itemId: 204225, // Perfect Windfeather
            questId: 74321,
            source: 'FR: Gareed',
        },
    ],
    bookQuests: [
        {
            itemId: 200975, // Artisan's Consortium, Preferred
            questId: 71903,
            source: 'AC 2',
        },
        {
            itemId: 201271, // Artisan's Consortium, Valued
            questId: 71914,
            source: 'AC 4',
        },
        {
            itemId: 201282, // Artisan's Consortium, Esteemed
            questId: 71925,
            source: 'AC 5',
        },
        {
            itemId: 201715, // Notebook of Crafting Knowledge
            questId: 72303, // Expedition Crafting Knowledge
            source: 'DE 14',
        },
        {
            itemId: 201715, // Notebook of Crafting Knowledge
            questId: 72309, // Expedition Crafting Knowledge
            source: 'DE 23',
        },
        {
            itemId: 201715, // Notebook of Crafting Knowledge
            questId: 72333, // Crafting Your Start
            source: 'VA 14',
        },
        {
            itemId: 201715, // Notebook of Crafting Knowledge
            questId: 72336, // Crafting for Expertise
            source: 'VA 24',
        },
        {
            itemId: 205355, // Niffen Notebook of Tailoring Knowledge
            questId: 75757,
            source: 'LN',
        },
        {
            itemId: 205442, // Bartered Tailoring Journal
            questId: 75858,
            source: 'ZCB',
        },
        {
            itemId: 205431, // Bartered Tailoring Notes
            questId: 75837,
            source: 'ZCB',
        },
    ],
    treasureQuests: [
        {
            itemId: 206019, // Abandoned Reserve Chute
            questId: 76102,
            source: 'ZC',
        },
        {
            itemId: 201019, // Ancient Dragonweave Bolt
            questId: 70372,
            source: 'TD',
        },
        {
            itemId: 198692, // Noteworthy Scrap of Carpet
            questId: 70295,
            source: 'OP',
        },
        {
            itemId: 198680, // Decaying Brackenhide Blanket
            questId: 70284,
            source: 'AS',
        },
        {
            itemId: 206030, // Exquisitely Embroidered Banner
            questId: 76116,
            source: 'ZC',
        },
        {
            itemId: 198662, // Intriguing Bolt of Blue Cloth
            questId: 70267,
            source: 'AS',
        },
        {
            itemId: 198702, // Itinerant Singed Fabric
            questId: 70304,
            source: 'WS',
        },
        {
            itemId: 198684, // Miniature Bronze Dragonflight Banner
            questId: 70288,
            source: 'TD',
        },
        {
            itemId: 198699, // Mysterious Banner
            questId: 70302,
            source: 'WS',
        },
        {
            itemId: 201020, // Silky Surprise
            questId: 70303,
            source: 'OP',
        },
        {
            itemId: 206025, // Used Medical Wrap Kit
            questId: 76110,
            source: 'ZC',
        },
        {
            itemId: 210461, // Exceedingly Soft Wildercloth
            questId: 78414,
            source: 'ED',
        },
        {
            itemId: 210462, // Plush Pillow
            questId: 78415,
            source: 'ED',
        },
        {
            itemId: 210463, // Snuggle Buddy
            questId: 78416,
            source: 'ED',
        },
    ],
};
