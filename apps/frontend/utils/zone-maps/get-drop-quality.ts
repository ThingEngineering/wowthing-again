import { get } from 'svelte/store';

import { itemStore } from '@/stores';
import { RewardType } from '@/enums/reward-type';
import type { ManualDataZoneMapDrop } from '@/types/data/manual';

export function getDropQuality(drop: ManualDataZoneMapDrop): number {
    const itemData = get(itemStore);

    if (
        drop.type === RewardType.Item ||
        drop.type === RewardType.Toy ||
        drop.type === RewardType.Cosmetic ||
        drop.type === RewardType.Armor ||
        drop.type === RewardType.Weapon ||
        drop.type === RewardType.Transmog
    ) {
        return itemData.items[drop.id]?.quality || 1;
    } else if (drop.type === RewardType.Mount) {
        return 4;
    } else if (drop.type === RewardType.Pet) {
        return 3;
    }
    return 1;
}
