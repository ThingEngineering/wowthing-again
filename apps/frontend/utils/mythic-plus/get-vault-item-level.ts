import { dungeonVaultItemLevel } from '@/data/vault';

export function getVaultItemLevel(keyLevel: number): number[] {
    for (const [tierKeyLevel, tierItemLevel, tierQuality] of dungeonVaultItemLevel) {
        if (keyLevel >= tierKeyLevel) {
            return [tierItemLevel, tierQuality];
        }
    }
    return [0, 0];
}
