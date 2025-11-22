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
        [6, 'Bank Tab 1', 98],
        [7, 'Bank Tab 2', 98],
        [8, 'Bank Tab 3', 98],
        [9, 'Bank Tab 4', 98],
        [10, 'Bank Tab 5', 98],
        [11, 'Bank Tab 6', 98],
    ],
};
