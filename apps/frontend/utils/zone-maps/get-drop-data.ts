import { ItemQuality } from '@/enums/item-quality';
import { RewardType } from '@/enums/reward-type';
import { wowthingData } from '@/shared/stores/data';
import type { ManualDataZoneMapDrop } from '@/types/data/manual';

export interface DropData {
    linkId: number;
    linkType: string;
    name: string;
    quality: ItemQuality;
}

export function getDropData(drop: ManualDataZoneMapDrop): DropData {
    const ret = {
        linkId: 0,
        linkType: '',
        name: '',
        quality: ItemQuality.Common,
    };

    if (
        drop.type === RewardType.Item ||
        drop.type === RewardType.Cosmetic ||
        drop.type === RewardType.Armor ||
        drop.type === RewardType.Weapon ||
        drop.type === RewardType.Transmog
    ) {
        const item = wowthingData.items.items[drop.id];
        ret.linkId = drop.id;
        ret.linkType = 'item';
        ret.name = item?.name || `Unknown item #${drop.id}`;
        ret.quality = item?.quality || ItemQuality.Common;
    } else if (drop.type === RewardType.Mount) {
        const mount = wowthingData.static.mountById.get(drop.id);
        ret.linkId = mount?.itemIds?.at(-1) || 0;
        ret.linkType = 'item';
        ret.name = mount?.name || `Unknown mount #${drop.id}`;
        ret.quality = wowthingData.items.items[ret.linkId]?.quality || ItemQuality.Epic;
    } else if (drop.type === RewardType.Pet) {
        const pet = wowthingData.static.petById.get(drop.id);
        ret.linkId = pet?.creatureId || 0;
        ret.linkType = 'npc';
        ret.name = pet?.name || `Unknown pet #${drop.id}`;
        ret.quality = ItemQuality.Rare; // TODO fix this when pets have itemId
    } else if (drop.type === RewardType.Toy) {
        const toy = wowthingData.static.toyByItemId.get(drop.id);
        ret.linkId = drop.id;
        ret.linkType = 'item';
        ret.name = toy?.name || `Unknown toy #${drop.id}`;
        ret.quality = wowthingData.items.items[drop.id]?.quality || ItemQuality.Rare;
    }

    return ret;
}
