import { keyVaultItemLevel } from '@/data/dungeon'


export function getVaultQualityByItemLevel(itemLevel: number) {
    for (const [, tierItemLevel, tierQuality] of keyVaultItemLevel) {
        if (itemLevel >= tierItemLevel) {
            return tierQuality
        }
    }
    return 0
}
