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

        for (const [bonusType, ...bonusValues] of itemBonus.bonuses || []) {
            if (bonusType === ItemBonusType.IncreaseItemLevel) {
                ret.itemLevel += bonusValues[0];
            } else if (bonusType === ItemBonusType.SetItemQuality) {
                ret.quality = bonusValues[0];
            } else if (bonusType === ItemBonusType.BaseItemLevel) {
                ret.itemLevel = bonusValues[0];
            } else if (bonusType === ItemBonusType.ScaleConfig) {
                const scalingConfig = wowthingData.items.itemScalingConfigById.get(bonusValues[0]);
                if (scalingConfig) {
                    ret.itemLevel = scalingConfig.itemLevel;

                    // debugging scaling config pain
                    // const squishCurve = wowthingData.items.curveById.get(
                    //     wowthingData.items.itemSquishEras[scalingConfig.itemSquishEraId] || 0
                    // );
                    // const offsetCurve = wowthingData.items.itemOffsetCurveById.get(
                    //     scalingConfig.itemOffsetCurveId
                    // );
                    // const curve = wowthingData.items.curveById.get(offsetCurve?.curveId);
                    // console.log('ScalingConfig', {
                    //     value: bonusValues[0],
                    //     squishCurve,
                    //     scalingConfig,
                    //     offsetCurve,
                    //     curve,
                    // });
                }
            } else if (bonusType === ItemBonusType.ScaleCrafted) {
                // TODO: fix for non-profession items?
                if (bonusValues[1] === 2) {
                    ret.itemLevel += bonusValues[0];
                    ret.bonusStars = bonusValues[2];
                }
            }
        }
    }

    return ret;
}
