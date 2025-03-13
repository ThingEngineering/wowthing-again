import { InventoryType } from '@/enums/inventory-type';
import type { ConvertibleCategory } from './types';
import { ArmorType } from '@/enums/armor-type';
import { AppearanceModifier } from '@/enums/appearance-modifier';

export const modifierToTier: Record<number, number> = {
    [AppearanceModifier.Mythic]: 4,
    [AppearanceModifier.Heroic]: 3,
    [AppearanceModifier.Normal]: 2,
    [AppearanceModifier.LookingForRaid]: 1,
};

type CrestData = [number, number][];

export const currentUpgrade1: CrestData = [[3107, 15]]; // Weathered
export const currentUpgrade2: CrestData = [[3108, 15]]; // Carved
export const currentUpgrade3: CrestData = [[3109, 15]]; // Runed
export const currentUpgrade4: CrestData = [[3110, 15]]; // Gilded

// ID = ItemConversion.db2
export const convertibleCategories: ConvertibleCategory[] = [
    {
        id: 10,
        minimumLevel: 80,
        name: '[TWW] Season 2',
        slug: 'tww-season-2',
        conversionCurrencyId: 3116, // Essence of Kaja'mite
        tiers: [
            {
                itemLevel: 662,
                highUpgrade: currentUpgrade4,
                lowUpgrade: currentUpgrade3,
            },
            {
                itemLevel: 649,
                highUpgrade: currentUpgrade3,
                lowUpgrade: currentUpgrade2,
            },
            {
                itemLevel: 636,
                highUpgrade: currentUpgrade2,
                lowUpgrade: currentUpgrade1,
            },
            {
                itemLevel: 623,
                highUpgrade: currentUpgrade1,
            },
        ],
        purchases: [
            {
                costId: 2815, // Resonance Crystals
                costAmount: {
                    [InventoryType.Hands]: 3900,
                },
                upgradeTier: 2,
            },
            {
                costId: 2815, // Resonance Crystals
                costAmount: {
                    [InventoryType.Feet]: 2600,
                },
                upgradeTier: 1,
            },
        ],
    },
    {
        id: 8,
        minimumLevel: 80,
        name: '[TWW] Season 1',
        slug: 'tww-season-1',
        conversionCurrencyId: 2813, // Harmonized Silk
        tiers: [
            {
                itemLevel: 623,
            },
            {
                itemLevel: 610,
            },
            {
                itemLevel: 597,
            },
            {
                itemLevel: 583,
            },
        ],
        purchases: [
            // {
            //     costId: 2123, // Bloody Tokens
            //     costAmount: {
            //         [InventoryType.Head]: 875,
            //         [InventoryType.Shoulders]: 700,
            //         [InventoryType.Back]: 525,
            //         [InventoryType.Chest]: 875,
            //         [InventoryType.Wrist]: 525,
            //         [InventoryType.Hands]: 700,
            //         [InventoryType.Waist]: 700,
            //         [InventoryType.Legs]: 875,
            //         [InventoryType.Feet]: 700,
            //     },
            //     upgradeTier: 1,
            // },
            {
                costId: 3090, // Flame-Blessed Iron
                costAmount: {
                    [InventoryType.Head]: 175,
                    [InventoryType.Shoulders]: 140,
                    [InventoryType.Back]: 105,
                    [InventoryType.Chest]: 175,
                    [InventoryType.Wrist]: 105,
                    [InventoryType.Hands]: 140,
                    [InventoryType.Waist]: 140,
                    [InventoryType.Legs]: 175,
                    [InventoryType.Feet]: 140,
                },
                upgradeTier: 1,
            },
        ],
    },
    {
        id: 9,
        minimumLevel: 70,
        name: '[DF] Season 4',
        slug: 'df-season-4',
        conversionCurrencyId: 2912, // Renascent Awakening
        tiers: [
            {
                itemLevel: 519,
            },
            {
                itemLevel: 506,
            },
            {
                itemLevel: 493,
            },
            {
                itemLevel: 480,
            },
        ],
    },
    {
        id: 7,
        minimumLevel: 70,
        name: '[DF] Season 3',
        slug: 'df-season-3',
        conversionCurrencyId: 2796, // Renascent Dream
        tiers: [
            {
                itemLevel: 480,
            },
            {
                itemLevel: 467,
            },
            {
                itemLevel: 454,
            },
            {
                itemLevel: 441,
            },
        ],
    },
    {
        id: 6,
        minimumLevel: 70,
        name: '[DF] Season 2',
        slug: 'df-season-2',
        tiers: [
            {
                itemLevel: 441,
            },
            {
                itemLevel: 428,
            },
            {
                itemLevel: 415,
            },
            {
                itemLevel: 402,
            },
        ],
        sourceTier: 1,
        sources: {
            [ArmorType.Cloth]: {
                [InventoryType.Head]: 208891,
                [InventoryType.Shoulders]: 208903,
                [InventoryType.Back]: 208922,
                [InventoryType.Chest]: 208895,
                [InventoryType.Wrist]: 208908,
                [InventoryType.Hands]: 208918,
                [InventoryType.Waist]: 208911,
                [InventoryType.Legs]: 208900,
                [InventoryType.Feet]: 208917,
            },
            [ArmorType.Leather]: {
                [InventoryType.Head]: 208893,
                [InventoryType.Shoulders]: 208905,
                [InventoryType.Back]: 208922,
                [InventoryType.Chest]: 208897,
                [InventoryType.Wrist]: 208906,
                [InventoryType.Hands]: 208921,
                [InventoryType.Waist]: 208913,
                [InventoryType.Legs]: 208898,
                [InventoryType.Feet]: 208914,
            },
            [ArmorType.Mail]: {
                [InventoryType.Head]: 208892,
                [InventoryType.Shoulders]: 208904,
                [InventoryType.Back]: 208922,
                [InventoryType.Chest]: 208896,
                [InventoryType.Wrist]: 208907,
                [InventoryType.Hands]: 208920,
                [InventoryType.Waist]: 208912,
                [InventoryType.Legs]: 208899,
                [InventoryType.Feet]: 208915,
            },
            [ArmorType.Plate]: {
                [InventoryType.Head]: 208890,
                [InventoryType.Shoulders]: 208902,
                [InventoryType.Back]: 208922,
                [InventoryType.Chest]: 208894,
                [InventoryType.Wrist]: 208909,
                [InventoryType.Hands]: 208919,
                [InventoryType.Waist]: 208910,
                [InventoryType.Legs]: 208901,
                [InventoryType.Feet]: 208916,
            },
        },
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
];

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
];
