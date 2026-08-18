import { keyVaultItemLevel } from '@/data/vault';

export function getVaultQualityByItemLevel(itemLevel: number) {
    for (const [, tierItemLevel, tierQuality] of keyVaultItemLevel) {
        if (itemLevel >= tierItemLevel) {
            return tierQuality;
        }
    }
    return 0;
}
