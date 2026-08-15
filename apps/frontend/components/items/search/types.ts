import type { ItemLocation } from '@/enums/item-location';
import type { UserItem } from '@/types/shared';

export type SearchItemsResult = {
    tooManyItems: boolean;
    results: [ItemLocation, number, UserItem][];
};
