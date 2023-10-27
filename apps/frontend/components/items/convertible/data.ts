import { InventoryType } from '@/enums/inventory-type'
import type { ConvertibleCategory } from './types'
import { ArmorType } from '@/enums/armor-type'
import { AppearanceModifier } from '@/enums/appearance-modifier'


export const modifierToTier: Record<number, number> = {
    [AppearanceModifier.Mythic]: 4,
    [AppearanceModifier.Heroic]: 3,
    [AppearanceModifier.Normal]: 2,
    [AppearanceModifier.LookingForRaid]: 1
}

const dfS2Whelpling: [number, number][] = [
    [204193, 1],
    [204075, 15],
]
const dfS2Drake: [number, number][] = [
    [204195, 1],
    [204076, 15],
]
const dfS2Wyrm: [number, number][] = [
    [204196, 1],
    [204077, 15],
]
const dfS2Aspect: [number, number][] = [
    [204194, 1],
    [204078, 15],
]

const dfS3Whelpling: [number, number][] = [
    [2706, 1],
]
const dfS3Drake: [number, number][] = [
    [2707, 1],
]
const dfS3Wyrm: [number, number][] = [
    [2708, 1],
]
const dfS3Aspect: [number, number][] = [
    [2709, 1],
]

export const convertibleCategories: ConvertibleCategory[] = [
    {
        id: 7,
        minimumLevel: 70,
        name: '[DF] Season 3',
        slug: 'df-season-3',
        tiers: [
            {
                itemLevel: 480,
            },
            {
                itemLevel: 467,
                lowUpgrade: dfS3Wyrm,
                highUpgrade: dfS3Aspect,
            },
            {
                itemLevel: 454,
                lowUpgrade: dfS3Drake,
                highUpgrade: dfS3Wyrm,
            },
            {
                itemLevel: 441,
                lowUpgrade: dfS3Whelpling,
                highUpgrade: dfS3Drake,
            },
        ]
    },
    {
        id: 6,
        minimumLevel: 70,
        name: '[DF] Season 2',
        slug: 'df-season-2',
        conversionCurrencyId: 2533, // Renascent Shadowflame
        tiers: [
            {
                itemLevel: 441,
                lowUpgrade: dfS2Aspect,
            },
            {
                itemLevel: 428,
                lowUpgrade: dfS2Wyrm,
                highUpgrade: dfS2Aspect,
            },
            {
                itemLevel: 415,
                lowUpgrade: dfS2Drake,
                highUpgrade: dfS2Wyrm,
            },
            {
                itemLevel: 402,
                lowUpgrade: dfS2Whelpling,
                highUpgrade: dfS2Drake,
            },
        ],
        purchases: [
            {
                costId: 207030, // Dilated Time Capsule
                costAmount: 1,
                upgradeTier: 1,
                progressKey: 'dfTimeRift',
            },
            {
                costId: 207026, // Dreamsurge Coalescence
                costAmount: 100,
                upgradeTier: 1,
            },
            {
                costId: 208153, // Dreamsurge Chrysalis
                costAmount: 1,
                upgradeTier: 2,
                progressKey: 'dfDreamsurge',
            },
        ],
    },
    {
        id: 3,
        minimumLevel: 70,
        name: '[DF] Season 1',
        slug: 'df-season-1',
        tiers: [
            {
                itemLevel: 415,
            },
            {
                itemLevel: 402,
            },
            {
                itemLevel: 389,
            },
            {
                itemLevel: 376,
            },
        ],
        purchases: [
            {
                costId: 2122, // Storm Sigil
                costAmount: {
                    [InventoryType.Head]: 10,
                    [InventoryType.Shoulders]: 7,
                    [InventoryType.Back]: 5,
                    [InventoryType.Chest]: 10,
                    [InventoryType.Wrist]: 5,
                    [InventoryType.Hands]: 7,
                    [InventoryType.Waist]: 5,
                    [InventoryType.Legs]: 10,
                    [InventoryType.Feet]: 7,
                },
                upgradeTier: 2,
            },
        ],
        sourceTier: 2,
        sources: {
            [ArmorType.Cloth]: {
                [InventoryType.Head]: 203612,
                [InventoryType.Shoulders]: 203627,
                [InventoryType.Back]: 203646,
                [InventoryType.Chest]: 203616,
                [InventoryType.Wrist]: 203632,
                [InventoryType.Hands]: 203642,
                [InventoryType.Waist]: 203635,
                [InventoryType.Legs]: 203622,
                [InventoryType.Feet]: 203641,
            },
            [ArmorType.Leather]: {
                [InventoryType.Head]: 203614,
                [InventoryType.Shoulders]: 203629,
                [InventoryType.Back]: 203646,
                [InventoryType.Chest]: 203618,
                [InventoryType.Wrist]: 203630,
                [InventoryType.Hands]: 203645,
                [InventoryType.Waist]: 203637,
                [InventoryType.Legs]: 203619,
                [InventoryType.Feet]: 203638,
            },
            [ArmorType.Mail]: {
                [InventoryType.Head]: 203613,
                [InventoryType.Shoulders]: 203628,
                [InventoryType.Back]: 203646,
                [InventoryType.Chest]: 203617,
                [InventoryType.Wrist]: 203631,
                [InventoryType.Hands]: 203644,
                [InventoryType.Waist]: 203636,
                [InventoryType.Legs]: 203620,
                [InventoryType.Feet]: 203639,
            },
            [ArmorType.Plate]: {
                [InventoryType.Head]: 203611,
                [InventoryType.Shoulders]: 203626,
                [InventoryType.Back]: 203646,
                [InventoryType.Chest]: 203615,
                [InventoryType.Wrist]: 203633,
                [InventoryType.Hands]: 203643,
                [InventoryType.Waist]: 203634,
                [InventoryType.Legs]: 203623,
                [InventoryType.Feet]: 203640,
            },
        },
    },
]

export const convertibleTypes: InventoryType[] = [
    InventoryType.Head,
    InventoryType.Shoulders,
    InventoryType.Back,
    InventoryType.Chest,
    InventoryType.Wrist,
    InventoryType.Hands,
    InventoryType.Waist,
    InventoryType.Legs,
    InventoryType.Feet,
]