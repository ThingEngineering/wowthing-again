import { derived } from 'svelte/store';

import { ItemBonusType } from '@/enums/item-bonus-type';
import { itemStore } from '@/stores';

export const getBonusIdModifier = derived([itemStore], ([$itemStore]) => {
    return (bonusIds: number[]) => {
        let modifier = 0;
        let priority = 999;
        for (const bonusId of bonusIds) {
            const itemBonus = $itemStore.itemBonuses[bonusId];
            if (!(itemBonus?.bonuses?.length > 0)) {
                continue;
            }

            for (const [bonusType, ...bonusValues] of itemBonus.bonuses) {
                if (bonusType === ItemBonusType.SetItemAppearanceModifier) {
                    const bonusPriority = bonusValues[1] || 0;
                    if (bonusPriority < priority) {
                        modifier = bonusValues[0];
                        priority = bonusPriority;
                    }
                }
            }
        }

        return modifier;
    };
});
