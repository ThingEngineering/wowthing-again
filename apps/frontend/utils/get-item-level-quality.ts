import { itemLevelQuality, remixItemLevelQuality } from '@/data/item-level-quality';

export default function getItemLevelQuality(itemLevel: number, remix?: boolean): number {
    const qualities = remix ? remixItemLevelQuality : itemLevelQuality;
    for (const [minItemLevel, quality] of qualities) {
        if (itemLevel >= minItemLevel) {
            return quality;
        }
    }

    return 0;
}
