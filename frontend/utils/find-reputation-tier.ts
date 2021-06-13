import type { StaticDataReputationTier } from '@/types'
import { ReputationTier } from '@/types'

export default function findReputationTier(
    tiers: StaticDataReputationTier,
    characterRep: number,
): ReputationTier | undefined {
    for (let i = 0; i < tiers.MinValues.length; i++) {
        const finalTier = tiers.MinValues[i] === tiers.MaxValues[i]
        if (
            characterRep >= tiers.MinValues[i] &&
            (characterRep < tiers.MaxValues[i] || finalTier)
        ) {
            let value: number
            let maxValue: number
            let percent: string

            if (finalTier) {
                value = 0
                maxValue = 0
                percent = '100'
            } else {
                value = characterRep - tiers.MinValues[i]
                maxValue = tiers.MaxValues[i] - tiers.MinValues[i]
                percent = ((value / maxValue) * 100).toFixed(1)
            }
            return new ReputationTier(
                tiers.Names[i],
                tiers.MinValues.length - i,
                maxValue,
                value,
                percent,
            )
        }
    }
}
