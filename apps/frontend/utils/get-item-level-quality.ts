import { itemLevelQuality } from '@/data/item-level-quality'

export default function getItemLevelQuality(itemLevel: number): number {
    for (const [minItemLevel, quality] of itemLevelQuality) {
        if (itemLevel >= minItemLevel) {
            return quality
        }
    }

    return 0
}
