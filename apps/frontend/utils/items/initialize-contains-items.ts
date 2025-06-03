import { wowthingData } from '@/shared/stores/data';
import type { ContainsItems, UserItem } from '@/types/shared';

import { getBonusIdModifier } from './get-bonus-id-modifier';

export function initializeContainsItems<T extends ContainsItems>(
    container: T,
    userItems: UserItem[]
) {
    const itemsByAppearanceId: typeof container.itemsByAppearanceId = {};
    const itemsByAppearanceSource: typeof container.itemsByAppearanceSource = {};
    const itemsById: typeof container.itemsById = {};

    for (const userItem of userItems) {
        (itemsById[userItem.itemId] ||= []).push(userItem);

        const item = wowthingData.items.items[userItem.itemId];
        if (!item) {
            continue;
        }

        let modifier = getBonusIdModifier(userItem.bonusIds);

        userItem.appearanceId = item.appearances[modifier]?.appearanceId;
        if (userItem.appearanceId === undefined && modifier > 0) {
            modifier = 0;
            userItem.appearanceId = item.appearances[modifier]?.appearanceId;
        }
        userItem.appearanceModifier = modifier;
        userItem.appearanceSource = `${userItem.itemId}_${modifier}`;

        if (userItem.appearanceId !== undefined) {
            (itemsByAppearanceId[userItem.appearanceId] ||= []).push(userItem);
            (itemsByAppearanceSource[userItem.appearanceSource] ||= []).push(userItem);
        }
    }

    container.itemsByAppearanceId = itemsByAppearanceId;
    container.itemsByAppearanceSource = itemsByAppearanceSource;
    container.itemsById = itemsById;
}
