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
        bonusStars: 0,
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
            } else if (bonus[0] === ItemBonusType.ScaleConfig) {
                if (scaleConfigToItemLevel[bonus[1]]) {
                    ret.itemLevel = scaleConfigToItemLevel[bonus[1]];
                }
            } else if (bonus[0] === ItemBonusType.ScaleCrafted) {
                // TODO: fix for non-profession items?
                if (bonus[2] === 2) {
                    ret.itemLevel += bonus[1];
                    ret.bonusStars = bonus[3];
                }
            }
        }
    }

    return ret;
}

// I don't want to deal with all of the item scaling dumps, hardcode it for now
const scaleConfigToItemLevel: Record<number, number> = {
    266: 206,
};
