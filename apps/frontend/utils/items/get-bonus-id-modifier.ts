import { ItemBonusType } from '@/enums/item-bonus-type';
import { wowthingData } from '@/shared/stores/data';

export function getBonusIdModifier(bonusIds: number[]): number {
    let modifier = 0;
    let priority = 999;
    for (const bonusId of bonusIds) {
        const itemBonus = wowthingData.items.itemBonuses[bonusId];
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
}
