import { InventoryType } from '@/enums/inventory-type'
import type { ConvertibleCategory } from './types'


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
    },
    // {
    //     id: 3,
    //     minimumLevel: 70,
    //     name: '[DF] Season 1',
    //     slug: 'df-season-1',
    // },
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