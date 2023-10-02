import { ItemLocation } from '@/enums/item-location'

export const bagSlots: Record<number, [number, string, number?][]> = {
    [ItemLocation.Bags]: [
        [0, 'Backpack', 20],
        [1, 'Bag 1'],
        [2, 'Bag 2'],
        [3, 'Bag 3'],
        [4, 'Bag 4'],
        [5, 'Reagent Bag'],
    ],
    [ItemLocation.Bank]: [
        [-1, 'Bank', 28],
        [6, 'Bag 1'],
        [7, 'Bag 2'],
        [8, 'Bag 3'],
        [9, 'Bag 4'],
        [10, 'Bag 5'],
        [11, 'Bag 6'],
        [12, 'Bag 7'],
        [-3, 'Reagents', 98],
    ],
}
