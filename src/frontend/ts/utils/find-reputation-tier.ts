import type {StaticDataReputationTier} from '../types'

export default function findReputationTier(tiers: StaticDataReputationTier, characterRep: number): [string, number, string]
{
    let name: string
    let tier: number
    let value: string
    for (let i = 0; i < tiers.MinValues.length; i++) {
        const finalTier = tiers.MinValues[i] === tiers.MaxValues[i]
        if (characterRep >= tiers.MinValues[i] && (characterRep < tiers.MaxValues[i] || finalTier)) {
            name = tiers.Names[i]
            tier = tiers.MinValues.length - i
            if (finalTier) {
                value = "100"
            } else {
                value = ((characterRep - tiers.MinValues[i]) / (tiers.MaxValues[i] - tiers.MinValues[i]) * 100).toFixed(1)
            }
            break
        }
    }

    return [name, tier, value]
}
