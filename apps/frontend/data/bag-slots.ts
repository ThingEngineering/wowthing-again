import { ItemLocation } from '@/enums/item-location';

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
        [6, 'Bank Bag 1'],
        [7, 'Bank Bag 2'],
        [8, 'Bank Bag 3'],
        [9, 'Bank Bag 4'],
        [10, 'Bank Bag 5'],
        [11, 'Bank Bag 6'],
        [12, 'Bank Bag 7'],
        [-3, 'Reagent Bank', 98],
    ],
};
