import { ReputationTier } from '@/types';
import type { StaticDataReputationTier } from '@/shared/stores/static/types';

export default function findReputationTier(
    tiers: StaticDataReputationTier,
    characterRep: number,
): ReputationTier | undefined {
    for (let i = tiers.minValues.length - 1; i >= 0; i--) {
        const finalTier = i === tiers.minValues.length - 1;
        if (characterRep >= tiers.minValues[i]) {
            let value: number;
            let maxValue: number;
            let percent: string;

            if (finalTier) {
                value = 0;
                maxValue = 0;
                percent = '100';
            } else {
                value =
                    characterRep < 0
                        ? Math.abs(characterRep) + tiers.minValues[i]
                        : characterRep - tiers.minValues[i];
                maxValue =
                    tiers.minValues[i] < 0
                        ? tiers.minValues[i] - tiers.minValues[i + 1]
                        : tiers.minValues[i + 1] - tiers.minValues[i];
                percent = ((value / maxValue) * 100).toFixed(1);
            }

            return new ReputationTier(
                tiers.names[i],
                tiers.minValues.length - i,
                maxValue,
                value,
                percent,
            );
        }
    }
}
