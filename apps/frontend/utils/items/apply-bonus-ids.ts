import { ItemBonusType } from '@/enums/item-bonus-type';
import { wowthingData } from '@/shared/stores/data';

type Props = {
    itemLevel?: number;
    quality?: number;
};

export function applyBonusIds(bonusIds: number[], { itemLevel, quality }: Props) {
    const ret = {
        itemLevel: itemLevel || 0,
        quality: quality || 0,
    };

    for (const bonusId of bonusIds) {
        const itemBonus = wowthingData.items.itemBonuses[bonusId];
        if (!itemBonus) {
            continue;
        }

        for (const bonus of itemBonus.bonuses || []) {
            if (bonus[0] === ItemBonusType.IncreaseItemLevel) {
                ret.itemLevel += bonus[1];
            } else if (bonus[0] === ItemBonusType.SetItemQuality) {
                ret.quality = bonus[1];
            } else if (bonus[0] === ItemBonusType.BaseItemLevel) {
                ret.itemLevel = bonus[1];
            }
        }
    }

    return ret;
}
