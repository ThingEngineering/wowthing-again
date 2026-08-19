import { keyVaultItemLevel } from '@/data/vault';

export function getVaultItemLevel(keyLevel: number): number[] {
    for (const [tierKeyLevel, tierItemLevel, tierQuality] of keyVaultItemLevel) {
        if (keyLevel >= tierKeyLevel) {
            return [tierItemLevel, tierQuality];
        }
    }
    return [0, 0];
}
