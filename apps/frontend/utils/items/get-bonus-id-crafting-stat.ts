import { ItemBonusType } from '@/enums/item-bonus-type';
import { wowthingData } from '@/shared/stores/data';

export function getBonusIdCraftingStat(bonusIds: number[]) {
    for (const bonusId of bonusIds) {
        const itemBonus = wowthingData.items.itemBonuses[bonusId];
        if (!(itemBonus?.bonuses?.length > 0)) {
            continue;
        }

        for (const [bonusType, ...bonusValues] of itemBonus.bonuses) {
            if (bonusType === ItemBonusType.ModifiedCraftingStat) {
                return bonusValues[0];
            }
        }
    }

    return 0;
}
