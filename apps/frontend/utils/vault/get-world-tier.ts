import { worldVaultItemLevel } from '@/data/vault';

export function getWorldTier(tier: number): [number, number] {
    for (const [tierLevel, tierItemLevel, tierQuality] of worldVaultItemLevel) {
        if (tier >= tierLevel) {
            return [tierItemLevel, tierQuality];
        }
    }
    return [0, 0];
}
