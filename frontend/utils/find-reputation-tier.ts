import type { StaticDataReputationTier } from '@/types'
import { ReputationTier } from '@/types'

export default function findReputationTier(
    tiers: StaticDataReputationTier,
    characterRep: number,
): ReputationTier | undefined {
    for (let i = 0; i < tiers.minValues.length; i++) {
        const finalTier = tiers.minValues[i] === tiers.maxValues[i]
        if (
            characterRep >= tiers.minValues[i] &&
            (characterRep < tiers.maxValues[i] || finalTier)
        ) {
            let value: number
            let maxValue: number
            let percent: string

            if (finalTier) {
                value = 0
                maxValue = 0
                percent = '100'
            }
            else {
                value = characterRep - tiers.minValues[i]
                maxValue = tiers.maxValues[i] - tiers.minValues[i]
                percent = ((value / maxValue) * 100).toFixed(1)
            }

            return new ReputationTier(
                tiers.names[i],
                tiers.minValues.length - i,
                maxValue,
                value,
                percent,
            )
        }
    }
}
