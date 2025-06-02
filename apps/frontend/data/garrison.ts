import type { GarrisonTree } from '@/types';
import { imageStrings } from './icons';

export const garrisonUnlockQuests: number[] = [
    34586, // Alliance
    35378, // Horde
];

export const garrisonBuildingIcon: Record<number, string> = {
    // All

    // 64: '', // Fishing Shack 1
    // 134: '', // Fishing Shack 2
    // 135: '', // Fishing Shack 3

    // 29: '', // Herb Garden 1
    // 136: '', // Herb Garden 2
    // 137: '', // Herb Garden 3

    // 61: '', // Mine 1
    // 62: '', // Mine 2
    // 63: '', // Mine 3

    // 42: '', // Pet Menagerie 1
    // 167: '', // Pet Menagerie 1
    // 168: '', // Pet Menagerie 1

    // 205: 'achievement/10177', // Shipyard 1
    // 206: 'achievement/10177', // Shipyard 2
    // 207: 'achievement/10177', // Shipyard 3

    // Large

    26: 'achievement/9499', // Barracks 1
    27: 'achievement/9499', // Barracks 2
    28: 'achievement/9499', // Barracks 3

    8: 'achievement/9129', // Dwarven Bunker/War Mill 1
    9: 'achievement/9129', // Dwarven Bunker/War Mill 2
    10: 'achievement/9129', // Dwarven Bunker/War Mill 3

    162: 'achievement/9527', // Gnomish Gearworks/Goblin Workshop 1
    163: 'achievement/9527', // Gnomish Gearworks/Goblin Workshop 2
    164: 'achievement/9527', // Gnomish Gearworks/Goblin Workshop 3

    37: 'achievement/9497', // Mage Tower/Spirit Lodge 1
    38: 'achievement/9497', // Mage Tower/Spirit Lodge 2
    39: 'achievement/9497', // Mage Tower/Spirit Lodge 3

    65: 'achievement/9705', // Stables 1
    66: 'achievement/9705', // Stables 2
    67: 'achievement/9705', // Stables 3

    // Medium

    24: 'achievement/9452', // Barn 1
    25: 'achievement/9452', // Barn 2
    133: 'achievement/9452', // Barn 3

    159: 'achievement/9738', // Gladiator's Sanctum 1
    160: 'achievement/9738', // Gladiator's Sanctum 2
    161: 'achievement/9738', // Gladiator's Sanctum 3

    34: 'achievement/9703', // Inn 1
    35: 'achievement/9703', // Inn 2
    36: 'achievement/9703', // Inn 3

    40: 'achievement/9429', // Lumber Mill 1
    41: 'achievement/9429', // Lumber Mill 2
    138: 'achievement/9429', // Lumber Mill 3

    111: 'achievement/9478', // Trading Post 1
    144: 'achievement/9478', // Trading Post 2
    145: 'achievement/9478', // Trading Post 3

    // Small

    52: 'achievement/9468', // Salvage Yard 1
    140: 'achievement/9468', // Salvage Yard 2
    141: 'achievement/9468', // Salvage Yard 3

    51: 'achievement/9487', // Storehouse 1
    142: 'achievement/9487', // Storehouse 2
    143: 'achievement/9487', // Storehouse 3

    76: imageStrings.alchemy, // Alchemy Lab 1
    119: imageStrings.alchemy, // Alchemy Lab 2
    120: imageStrings.alchemy, // Alchemy Lab 3

    93: imageStrings.enchanting, // Enchanter's Study 1
    125: imageStrings.enchanting, // Enchanter's Study 2
    126: imageStrings.enchanting, // Enchanter's Study 3

    91: imageStrings.engineering, // Engineering Works 1
    123: imageStrings.engineering, // Engineering Works 2
    124: imageStrings.engineering, // Engineering Works 3

    96: imageStrings.jewelcrafting, // Gem Boutique 1
    131: imageStrings.jewelcrafting, // Gem Boutique 2
    132: imageStrings.jewelcrafting, // Gem Boutique 3

    95: imageStrings.inscription, // Scribe's Quarters 1
    129: imageStrings.inscription, // Scribe's Quarters 1
    130: imageStrings.inscription, // Scribe's Quarters 1

    94: imageStrings.tailoring, // Tailoring Emporium 1
    127: imageStrings.tailoring, // Tailoring Emporium 2
    128: imageStrings.tailoring, // Tailoring Emporium 3

    60: imageStrings.blacksmithing, // The Forge 1
    117: imageStrings.blacksmithing, // The Forge 2
    118: imageStrings.blacksmithing, // The Forge 3

    90: imageStrings.skinning, // The Tannery 1
    121: imageStrings.skinning, // The Tannery 2
    122: imageStrings.skinning, // The Tannery 3
};

export const garrisonTrees: Record<string, GarrisonTree> = {
    // boxOfManyThings: {
    //     id: 461,
    // },
    cypherResearch: {
        id: 474,
        direction: 'vertical',
        name: 'Cypher Research',
        tiers: [
            [
                {
                    id: 1901, // Metrial Understanding
                    costs: [5],
                    ranks: 1,
                },
                {
                    id: 1904, // Aealic Understanding
                    costs: [45],
                    ranks: 1,
                    requires: 1901,
                },
                {
                    id: 1932, // Dealic Understanding
                    costs: [200],
                    ranks: 1,
                    requires: 1904,
                },
                {
                    id: 1907, // Trebalim Understanding
                    costs: [260],
                    ranks: 1,
                    requires: 1932,
                },
            ],
            [null, null, null, null],
            [
                {
                    id: 1972, // Cachial Understanding
                    costs: [45],
                    ranks: 1,
                    requires: 1901,
                },
                {
                    id: 1902, // Altonian Understanding
                    costs: [160],
                    ranks: 1,
                    requires: 1904,
                },
                {
                    id: 1931, // Sopranian Understanding
                    costs: [220],
                    ranks: 1,
                    requires: 1932,
                },
                {
                    costs: [125, 135, 145],
                    id: 1998, // Bassalim Understanding
                    ranks: 1,
                    requires: 1907,
                },
            ],
            [
                {
                    id: 1976, // Creatian
                    costs: [25, 80, 100, 110],
                    ranks: 4,
                    requires: 1901,
                },
                {
                    id: 1989, // Simlic
                    costs: [70, 80, 95],
                    ranks: 3,
                    requires: 1904,
                },
                {
                    id: 1971, // Corial
                    costs: [60],
                    ranks: 1,
                    requires: 1932,
                },
                {
                    id: 1992, // Deflim
                    costs: [110, 125],
                    ranks: 2,
                    requires: 1907,
                },
            ],
            [
                {
                    id: 1970, // Echial
                    costs: [40],
                    ranks: 1,
                    requires: 1901,
                },
                {
                    id: 1990, // Enlic
                    costs: [65, 70, 85],
                    ranks: 3,
                    requires: 1904,
                },
                {
                    id: 1980, // Destrian
                    costs: [105, 115, 125],
                    requires: 1932,
                    ranks: 3,
                },
                {
                    id: 1993, // Suplim
                    costs: [100, 175],
                    requires: 1907,
                    ranks: 2,
                },
            ],
            [
                {
                    id: 1969, // Visial
                    costs: [130],
                    ranks: 1,
                    requires: 1901,
                },
                {
                    id: 1991, // Tilic
                    costs: [70, 95, 100],
                    ranks: 3,
                    requires: 1904,
                },
                {
                    id: 1983, // Allian
                    costs: [75, 95, 130],
                    ranks: 3,
                    requires: 1932,
                },
                {
                    id: 1997, // Maxlim
                    costs: [80, 120, 130],
                    ranks: 3,
                    requires: 1907,
                },
            ],
            [
                null,
                {
                    id: 1988, // Elic
                    costs: [115],
                    ranks: 1,
                    requires: 1904,
                },
                {
                    id: 1982, // Enrian
                    costs: [95, 105, 125],
                    ranks: 3,
                    requires: 1932,
                },
                null,
            ],
        ],
    },
    // pocopoc: {
    //     id: 476,
    // }
};

export const cypherTiers: number[][] = [
    [3700, 252],
    [2960, 249],
    [2220, 246],
    [1480, 242],
    [740, 239],
    [0, 233],
];
