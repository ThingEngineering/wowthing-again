import type { GarrisonTree } from '@/types'


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
            [
                null,
                null,
                null,
                null,
            ],
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
        ]
    },
    // pocopoc: {
    //     id: 476,
    // }
}

export const cypherTiers: number[][] = [
    [3700, 252],
    [2960, 249],
    [2220, 246],
    [1480, 242],
    [740, 239],
    [0, 233],
]
