import { dungeonVaultItemLevel } from '@/data/vault';

export function getVaultQualityByItemLevel(itemLevel: number) {
    for (const [, tierItemLevel, tierQuality] of dungeonVaultItemLevel) {
        if (itemLevel >= tierItemLevel) {
            return tierQuality;
        }
    }
    return 0;
}
