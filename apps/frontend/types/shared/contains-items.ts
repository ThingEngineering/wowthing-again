import type { UserItem } from './user-item';

export interface ContainsItems {
    itemsByAppearanceId: Record<number, UserItem[]>;
    itemsByAppearanceSource: Record<string, UserItem[]>;
    itemsById: Record<number, UserItem[]>;
}
