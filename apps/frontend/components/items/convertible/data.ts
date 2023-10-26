import { InventoryType } from '@/enums/inventory-type'
import type { ConvertibleCategory } from './types'
import { RewardType } from '@/enums/reward-type'


export const convertibleCategories: ConvertibleCategory[] = [
    {
        id: 7,
        minimumLevel: 70,
        name: '[DF] Season 3',
        slug: 'df-season-3',
    },
    {
        id: 6,
        minimumLevel: 70,
        name: '[DF] Season 2',
        slug: 'df-season-2',
        tiers: [
            441,
            428,
            415,
            402,
        ],
        purchases: [
            [
                RewardType.Item,
                207030, // Dilated Time Capsule
                1, // cost
                1, // tier
                'dfTimeRift',
            ],
            [
                RewardType.Item,
                207026, // Dreamsurge Coalescence
                100, // cost
                1, // upgrade tier
            ],
            [
                RewardType.Item,
                208153, // Dreamsurge Chrysalis
                1, // cost
                2, // upgrade tier
                'dfDreamsurge',
            ],
        ],
    },
    {
        id: 3,
        minimumLevel: 70,
        name: '[DF] Season 1',
        slug: 'df-season-1',
        tiers: [
            415,
            402,
            389,
            376,
        ],
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