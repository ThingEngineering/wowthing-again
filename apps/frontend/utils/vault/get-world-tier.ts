import { delveVaultItemLevel } from '@/data/dungeon';

export function getWorldTier(tier: number): [number, number] {
    for (const [tierLevel, tierItemLevel, tierQuality] of delveVaultItemLevel) {
        if (tier >= tierLevel) {
            return [tierItemLevel, tierQuality];
        }
    }
    return [0, 0];
}
