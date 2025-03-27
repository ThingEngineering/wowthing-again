import { Covenant } from '@/types';

export const covenantMap: Record<number, Covenant> = {
    1: new Covenant(1, 'Kyrian', 'kyrian', 'covenant_kyrian'),
    2: new Covenant(2, 'Venthyr', 'venthyr', 'covenant_venthyr'),
    3: new Covenant(3, 'Night Fae', 'night-fae', 'covenant_night_fae'),
    4: new Covenant(4, 'Necrolord', 'necrolord', 'covenant_necrolord'),
};

export const covenantOrder: number[] = [
    1, // Kyrian
    4, // Necrolord
    3, // Night Fae
    2, // Venthyr
];

export const covenantNameMap = Object.fromEntries(
    Object.entries(covenantMap).map(([, covenant]) => [covenant.name, covenant]),
);

export const covenantSlugMap: Record<string, Covenant> = Object.fromEntries(
    Object.values(covenantMap).map((c) => [c.slug, c]),
);

export const covenantFeatureOrder: [string, string, number][] = [
    ['conductor', 'Anima Conductor', 3],
    ['missions', 'Command Table', 3],
    ['transport', 'Transport Network', 3],
    ['unique', 'Special Feature', 5],
];

export const covenantFeatureReputation: Record<string, number> = {
    '2-unique': 2445, // The Ember Court
    '3-conductor': 2464, // Court of Night
    '3-transport': 2463, // Marasmius
    '4-unique': 2462, // Stitchmasters
};

export const covenantFeatureCost: Record<number, number[][]> = {
    1: [
        [1, 1000],
        [8, 5000],
        [22, 10000],
    ],
    2: [
        [1, 1000],
        [8, 5000],
        [22, 10000],
    ],
    3: [
        [1, 1000],
        [8, 5000],
        [22, 10000],
    ],
    4: [
        [6, 1500],
        [12, 5000],
        [22, 10000],
        [40, 12500],
        [70, 15000],
    ],
};

// Kyrian
// courage, loyalty, wisdom, humility
export const ascensionFightOrder = [
    'Courage',
    'Loyalty',
    'Wisdom',
    'Humility: Pelagos',
    'Humility: Kleia',
    'Humility: Mikanikos',
    'Humility: no charms',
];

type AscensionFight = {
    fightQuestIds: number[];
    name: string;
    unlockQuestId: number;
    unlockRanks: number[];
};
const unlocks1 = [1, 2, 3, 5, 5, 5, 5];
const unlocks2 = [2, 3, 4, 5, 5, 5, 5];

export const ascensionFights: AscensionFight[] = [
    {
        name: 'Kalisthene',
        unlockQuestId: 60496,
        unlockRanks: unlocks1,
        fightQuestIds: [60917, 61023, 61033, 63102, 63103, 63104, 61043],
    },
    {
        name: 'Echthra',
        unlockQuestId: 61356,
        unlockRanks: unlocks1,
        fightQuestIds: [60918, 61022, 61032, 63105, 63106, 63107, 61042],
    },
    {
        name: "Alderyn and Myn'ir",
        unlockQuestId: 61358,
        unlockRanks: unlocks1,
        fightQuestIds: [60919, 61021, 61031, 63108, 63109, 63110, 61041],
    },
    {
        name: 'Nuuminuuru',
        unlockQuestId: 61361,
        unlockRanks: unlocks1,
        fightQuestIds: [60921, 61020, 61030, 63111, 63112, 63113, 61040],
    },
    {
        name: 'Craven Corinth',
        unlockQuestId: 61370,
        unlockRanks: unlocks1,
        fightQuestIds: [60922, 61019, 61029, 63114, 63115, 63116, 61039],
    },
    {
        name: 'Splinterbark Nightmare',
        unlockQuestId: 61365,
        unlockRanks: unlocks1,
        fightQuestIds: [60923, 61018, 61028, 63117, 63118, 63119, 61038],
    },
    {
        name: "Thran'tiok",
        unlockQuestId: 61367,
        unlockRanks: unlocks2,
        fightQuestIds: [60924, 61017, 61027, 63120, 63121, 63122, 61037],
    },
    {
        name: 'Mad Mortimer',
        unlockQuestId: 61363,
        unlockRanks: unlocks2,
        fightQuestIds: [60925, 61016, 61026, 63123, 63124, 63125, 61036],
    },
    {
        name: 'Athanos',
        unlockQuestId: 61371,
        unlockRanks: unlocks2,
        fightQuestIds: [60926, 61015, 61025, 63126, 63127, 63128, 61035],
    },
    {
        name: 'Azaruux',
        unlockQuestId: 61373,
        unlockRanks: unlocks2,
        fightQuestIds: [60927, 61014, 61024, 63129, 63130, 63131, 61034],
    },
];

// itemId, questId
export const ascensionItems: [number, number][] = [
    [180579, 61473], // Herald's Footpads
    [181499, 60945], // Deep Echo Trident
    [184477, 62996], // Vial of Lichfrost
    [184478, 60974], // Phial of Serenity
    [184481, 62998], // Ring of Warding
    [184475, 62995], // Spiritforged Aegis
];

// Necrolords
// [criteriaId, spellId]
export class CovenantAbomination {
    constructor(
        public requiredRank: number,
        public questId: number,
        public spellId: number,
        public name: string,
        public shortName: string,
        public flesh: number,
        public parts: number,
        public itemIds?: number[],
    ) {}
}

export const abominations: CovenantAbomination[] = [
    new CovenantAbomination(1, 58410, 325454, 'Atticus', null, 10, 0),
    new CovenantAbomination(1, 60041, 325284, 'Chordy', 'Cho', 1, 0, [
        182507, // Stitched Conjurer's Cape [cloth]
        182498, // Stitched Wraith's Cloak [leather]
        182516, // Stitched Tactician's Drape [mail]
        182489, // Stitched Harbinger's Greatcloak [plate]
    ]),
    new CovenantAbomination(1, 57597, 325453, 'Flytrap', 'Fly', 10, 2, [
        182501, // Stitched Conjurer's Slippers [cloth]
        182492, // Stitched Wraith's Boots [leather]
        182510, // Stitched Tactician's Sabatons [mail]
        182483, // Stitched Harbinger's Stompers [plate]
    ]),
    new CovenantAbomination(1, 57611, 325452, 'Marz', 'Marz', 10, 1, [
        182500, // Stitched Conjurer's Tunic [cloth]
        182491, // Stitched Wraith's Jerkin [leather]
        182509, // Stitched Tactician's Hauberk [mail]
        182482, // Stitched Harbinger's Chestguard [plate]
    ]),
    new CovenantAbomination(1, 58415, 325458, 'Miru', null, 20, 0),
    new CovenantAbomination(1, 57605, 325451, 'Roseboil', 'Rose', 10, 1, [
        182505, // Stitched Conjurer's Cinch [cloth]
        182496, // Stitched Wraith's Belt [leather]
        182514, // Stitched Tactician's Girdle [mail]
        182487, // Stitched Harbinger's Warbelt [plate]
    ]),

    new CovenantAbomination(2, 57604, 326379, 'Neena', null, 20, 0),
    new CovenantAbomination(2, 57601, 326406, 'Professor', 'Prof', 15, 3, [
        182504, // Stitched Conjurer's Mantle [cloth]
        182495, // Stitched Wraith's Shoulders [leather]
        182513, // Stitched Tactician's Spaulders [mail]
        182486, // Stitched Harbinger's Pauldrons [plate]
    ]),
    new CovenantAbomination(2, 57600, 338040, 'Sabrina', 'Sab', 15, 4, [
        182503, // Stitched Conjurer's Leggings [cloth]
        182494, // Stitched Wraith's Breeches [leather]
        182512, // Stitched Tactician's Chausses [mail]
        182485, // Stitched Harbinger's Greaves [plate]
    ]),
    new CovenantAbomination(2, 58414, 326407, 'Toothpick', 'Tooth', 15, 4, [
        182506, // Stitched Conjurer's Wristwraps [cloth]
        182497, // Stitched Wraith's Armguards [leather]
        182515, // Stitched Tactician's Bracers [mail]
        182488, // Stitched Harbinger's Vambraces [plate]
    ]),

    new CovenantAbomination(3, 57608, 326380, 'Gas Bag', 'Gas', 20, 5, [
        182499, // Stitched Conjurer's Cowl [cloth]
        182490, // Stitched Wraith's Visage [leather]
        182508, // Stitched Tactician's Faceguard [mail]
        182481, // Stitched Harbinger's Greathelm [plate]
    ]),
    new CovenantAbomination(3, 58416, 338039, 'Guillotine', 'Guil', 20, 7, [
        182502, // Stitched Conjurer's Gloves [cloth]
        182493, // Stitched Wraith's Stranglers [leather]
        182511, // Stitched Tactician's Gauntlets [mail]
        182484, // Stitched Harbinger's Crushers [plate]
    ]),
    new CovenantAbomination(3, 60216, 326408, 'Mama Tomalin', null, 10, 1),

    new CovenantAbomination(4, 58411, 338037, 'Iron Phillip', null, 20, 10),
    new CovenantAbomination(4, 58413, 338043, 'Naxx', null, 20, 10),

    new CovenantAbomination(5, 61637, 343436, 'Unity', 'Unity', 30, 5),
];

// Night Fae
// [spellId, icon]
export const soulshapes: [number, string][] = [
    [65010, 'item/187882'], // Alpaca
    [62422, 'item/182165'], // Ardenmoth
    [65509, 'item/189977'], // Bat
    [65025, 'item/187905'], // Boar
    [65510, 'item/189980'], // Brutosaur
    [65640, 'item/190337'], // Cervid
    [65024, 'item/187904'], // Cloud Serpent
    [64651, 'item/182167'], // Cobra
    [62424, 'item/182168'], // Crane
    [63607, 'item/185051'], // Direhorn
    [65504, 'item/189971'], // Dragonhawk
    [65021, 'item/187901'], // Eagle
    [65507, 'item/189975'], // Elekk
    [62428, 'item/182172'], // Equine
    [65008, 'item/187880'], // Goat
    [62426, 'item/182170'], // Gryphon
    [62421, 'item/181314'], // Gulper
    [63608, 'item/185052'], // Hippo
    [62427, 'item/182171'], // Hippogryph
    [64650, 'item/182173'], // Hyena
    [65023, 'item/187903'], // Jormungar
    [63609, 'item/185053'], // Kodo
    [62429, 'item/182174'], // Leonine
    [62438, 'item/182182'], // Lupine
    [63610, 'item/185054'], // Mammoth
    [62430, 'item/182175'], // Moose
    [65026, 'item/187906'], // Owl
    [62432, 'item/182177'], // Owlcat
    [65009, 'item/187881'], // Ram
    [62433, 'item/182178'], // Raptor
    [65506, 'item/189973'], // Ray
    [62434, 'item/182179'], // Runestag
    [63605, 'item/185049'], // Saurolisk
    [65505, 'item/189972'], // Scorpid
    [62431, 'item/182176'], // Shadowstalker
    [63604, 'item/185048'], // Shoveltusk
    [62436, 'item/182185'], // Shrieker
    [65512, 'item/189982'], // Silithid
    [62420, 'item/181313'], // Snapper
    [63606, 'item/185050'], // Spider
    [65022, 'item/187902'], // Sporebat
    [62435, 'item/182180'], // Stag
    [65508, 'item/189976'], // Tallstrider
    [62437, 'item/182181'], // Tiger
    [62423, 'item/182166'], // Ursine
    [62425, 'item/182169'], // Veilwing
    //[0, 'item/0'], // Vulpin
    [62439, 'item/182183'], // Wolfhawk
    [62440, 'item/182184'], // Wyvern
    [63603, 'item/185047'], // Yak
];

// [spellId, icon]
export const crittershapes: [number, string][] = [
    [65514, 'item/189986'], // Armadillo
    [65518, 'item/189990'], // Bee
    [64984, 'item/187858'], // Bunny
    [64961, 'item/187819'], // Cat
    [64982, 'item/155858'], // Cat (Well Fed)
    [64941, 'item/187813'], // Chicken
    [64939, 'item/182671'], // Choofa/Squirrel
    [64938, 'item/158149'], // Corgi
    [64990, 'item/187871'], // Cricket
    [64994, 'item/187877'], // Frog
    [65513, 'item/189983'], // Gromit
    [64959, 'item/187818'], // Otter
    [65517, 'item/189989'], // Penguin
    [65515, 'item/189987'], // Pig
    [64989, 'item/187870'], // Porcupine
    [64992, 'item/187873'], // Prairie Dog
    [64985, 'item/187859'], // Rat
    [64995, 'item/187878'], // Saurid
    [64993, 'item/187876'], // Saurolisk Hatchling
    [65516, 'item/189988'], // Sheep
    [65519, 'item/189991'], // Snail
    [64988, 'item/187862'], // Snake
    [65467, 'item/189705'], // Turkey
];

export const shapeTooltip: Record<number, string> = {
    64982: 'Cat (Well Fed) Crittershape',
    64939: 'Choofa Crittershape',
    64938: 'Corgi Crittershape',
};

// Venthyr
export type EmberCourtFriend = {
    name: string;
    friendQuestId: number;
    reputationId: number;
    rsvpQuestId: number;
};
export const emberCourtFriends: Array<Array<EmberCourtFriend>> = [
    // Slot 1
    [
        {
            name: 'Sika',
            friendQuestId: 65140,
            reputationId: 2459,
            rsvpQuestId: 59425,
        },
        {
            name: 'Plague Deviser Marileth',
            friendQuestId: 65138,
            reputationId: 2461,
            rsvpQuestId: 59422,
        },
        {
            name: 'Choofa',
            friendQuestId: 65132,
            reputationId: 2454,
            rsvpQuestId: 59407,
        },
        {
            name: 'Cryptkeeper Kassir',
            friendQuestId: 65134,
            reputationId: 2455,
            rsvpQuestId: 59410,
        },
    ],
    // Slot 2
    [
        {
            name: 'Kleia & Pelagos',
            friendQuestId: 65137,
            reputationId: 2458,
            rsvpQuestId: 59419,
        },
        {
            name: 'Grandmaster Vole',
            friendQuestId: 65136,
            reputationId: 2457,
            rsvpQuestId: 59416,
        },
        {
            name: 'Droman Aliothe',
            friendQuestId: 65135,
            reputationId: 2456,
            rsvpQuestId: 59413,
        },
        {
            name: 'Stonehead',
            friendQuestId: 65141,
            reputationId: 2460,
            rsvpQuestId: 59619,
        },
    ],
    // Slot 3
    [
        {
            name: 'Polemarch Adrestes',
            friendQuestId: 65130,
            reputationId: 2452,
            rsvpQuestId: 59401,
        },
        {
            name: 'Alexandros Mograine',
            friendQuestId: 65128,
            reputationId: 2450,
            rsvpQuestId: 59395,
        },
        {
            name: 'Hunt-Captain Korayn',
            friendQuestId: 65129,
            reputationId: 2451,
            rsvpQuestId: 59398,
        },
        {
            name: 'Rendle & Cudgelface',
            friendQuestId: 65131,
            reputationId: 2453,
            rsvpQuestId: 59404,
        },
    ],
    // Slot 4
    [
        {
            name: 'Mikanikos',
            friendQuestId: 65124,
            reputationId: 2448,
            rsvpQuestId: 59389,
        },
        {
            name: 'Baroness Vashj',
            friendQuestId: 65121,
            reputationId: 2446,
            rsvpQuestId: 59383,
        },
        {
            name: 'Lady Moonberry',
            friendQuestId: 65123,
            reputationId: 2447,
            rsvpQuestId: 59386,
        },
        {
            name: 'The Countess',
            friendQuestId: 65126,
            reputationId: 2449,
            rsvpQuestId: 59392,
        },
    ],
];
// ^ how are these invited the first time?

export type EmberCourtFeatureType = {
    icon: string;
    name: string;
    requiredQuestId?: number;
    unlockQuestId: number;
    unlockReputation?: number;
};
export type EmberCourtFeature = {
    name: string;
    unlockQuestId: number;
    unlockReputation?: number;
    types: EmberCourtFeatureType[];
};

export const emberCourtFeatures: EmberCourtFeature[] = [
    {
        name: 'Entertainment',
        unlockQuestId: 61706,
        types: [
            {
                icon: 'achievement/14274', // Absolution for All
                name: 'Entertainment: Atoning Rituals',
                unlockQuestId: 61407,
            },
            {
                icon: 'item/147804', // Wild Dreamrunner
                name: 'Entertainment: Glimpse of the Wilds',
                unlockQuestId: 61408,
            },
            {
                icon: 'item/180062', // Heavenly Drum
                name: 'Entertainment: Lost Chalice Band',
                unlockQuestId: 61738,
                unlockReputation: 3, // Honored
            },
        ],
    },
    {
        name: 'Refreshments',
        unlockQuestId: 61705,
        types: [
            {
                icon: 'item/186525', // The Mad Duke's Tea
                name: "Refreshments: Tubbin's Tea Party",
                unlockQuestId: 61404,
            },
            {
                icon: 'item/140793', // Perfectly Preserved Cake
                name: 'Refreshments: Divine Desserts',
                unlockQuestId: 61405,
            },
            {
                icon: 'item/108907', // Mushroom of Destiny
                name: 'Refreshments: Mushroom Surprise',
                unlockQuestId: 61406,
                unlockReputation: 3, // Honored
            },
        ],
    },
    {
        name: 'Decorations', // Dredger Pool
        unlockQuestId: 61493,
        unlockReputation: 4, // Friendly
        types: [
            {
                icon: 'item/163924', // Whiskerwax Candle
                name: 'Decorations: Traditional Theme',
                unlockQuestId: 61398,
            },
            {
                icon: 'item/181367', // Ta Cartel Restock List
                name: 'Decorations: Mortal Reminders',
                unlockQuestId: 61399,
            },
            {
                icon: 'item/182210', // Vanity Mirror
                name: 'Decorations: Mystery Mirrors',
                unlockQuestId: 61400,
                unlockReputation: 2, // Revered
            },
        ],
    },
    {
        name: 'Security', // Guardhouse
        unlockQuestId: 61494,
        unlockReputation: 3, // Honored
        types: [
            {
                icon: 'achievement/15033', // Taking the Tremaculum
                name: 'Security: Venthyr Volunteers',
                unlockQuestId: 61401,
            },
            {
                icon: 'item/113381', // Crumbling Statue
                name: 'Security: Stoneborn Reserves',
                unlockQuestId: 61402,
            },
            {
                icon: 'achievement/15032', // Breaking Their Hold
                name: 'Security: Maldraxxian Army',
                unlockQuestId: 61403,
                unlockReputation: 2, // Revered
            },
        ],
    },
];

export const emberCourtUpgrades: EmberCourtFeature[] = [
    {
        name: 'Ambassadors',
        unlockQuestId: 0,
        types: [
            {
                icon: 'item/181521',
                name: 'Staff: Revendreth Ambassador (free reroll)',
                unlockQuestId: 61501,
                unlockReputation: 4, // Friendly
            },
            {
                icon: 'item/181524',
                name: 'Staff: Ardenweald Ambassador (free reroll)',
                unlockQuestId: 61502,
                unlockReputation: 3, // Honored
            },
            {
                icon: 'item/182342',
                name: 'Staff: Maldraxxus Ambassador (free reroll)',
                unlockQuestId: 61887,
                unlockReputation: 2, // Revered
            },
            {
                icon: 'item/182343',
                name: 'Staff: Bastion Ambassador (free reroll)',
                unlockQuestId: 61888,
                unlockReputation: 1, // Exalted
            },
        ],
    },
    {
        name: 'Upgrades',
        unlockQuestId: 0,
        types: [
            {
                icon: 'item/181532',
                name: 'Stock: Appetizers (+2 min)',
                unlockQuestId: 61498,
                unlockReputation: 4, // Friendly
            },
            {
                icon: 'item/181533',
                name: 'Stock: Anima Samples (+3 min)',
                unlockQuestId: 61499,
                unlockReputation: 3, // Honored
            },
            {
                icon: 'item/181530',
                name: 'Stock: Greeting Kits (+2 min)',
                unlockQuestId: 61497,
                unlockReputation: 2, // Revered
            },
            {
                icon: 'item/181535',
                name: 'Stock: Comfy Chairs (+5 min)',
                unlockQuestId: 61500,
                unlockReputation: 2, // Revered
            },
        ],
    },
];

export const emberCourtUpgrades2: EmberCourtFeature[] = [
    {
        name: 'Misc',
        unlockQuestId: 0,
        types: [
            {
                icon: 'item/181442',
                name: 'Visions of Sire Denathrius (bonus happiness)',
                unlockQuestId: 61458,
            },
            {
                icon: 'item/185741',
                name: 'Restock and Repair (auto-restock/repair)',
                unlockQuestId: 63765,
                unlockReputation: 1, // Exalted
            },
            {
                icon: 'item/181443',
                name: "The Party Herald's Party Hat (+30% rep)",
                unlockQuestId: 61459,
                unlockReputation: 1, // Exalted
            },
        ],
    },
];
