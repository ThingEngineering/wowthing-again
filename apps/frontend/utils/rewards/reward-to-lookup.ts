import { transmogTypes } from '@/data/transmog';
import { LookupType } from '@/enums/lookup-type';
import { RewardType } from '@/enums/reward-type';
import type { StaticData } from '@/shared/stores/static/types/store';
import type { ItemData } from '@/types/data/item/store';
import type { ManualData } from '@/types/data/manual/store';

const rewardLookupMap: Record<number, LookupType> = {
    [RewardType.AccountTrackingQuest]: LookupType.Quest,
    [RewardType.Illusion]: LookupType.Illusion,
    [RewardType.Mount]: LookupType.Mount,
    [RewardType.Pet]: LookupType.Pet,
    [RewardType.Toy]: LookupType.Toy,
};

export function rewardToLookup(
    itemData: ItemData,
    manualData: ManualData,
    staticData: StaticData,
    rewardType: RewardType,
    rewardId: number,
): [LookupType, number] {
    let ret: [LookupType, number] = [LookupType.None, 0];

    if (rewardLookupMap[rewardType]) {
        ret = [rewardLookupMap[rewardType], rewardId];
    } else if (rewardType === RewardType.Item) {
        if (staticData.mountsByItem[rewardId]) {
            ret = [LookupType.Mount, staticData.mountsByItem[rewardId].id];
        } else if (staticData.petsByItem[rewardId]) {
            ret = [LookupType.Pet, staticData.petsByItem[rewardId].id];
        } else if (staticData.toys[rewardId]) {
            ret = [LookupType.Toy, rewardId];
        } else if (itemData.teachesTransmog[rewardId]) {
            ret = [LookupType.TransmogSet, rewardId];
        } else if (itemData.completesQuest[rewardId]) {
            ret = [LookupType.Quest, rewardId];
        } else if (manualData.dragonridingItemToQuest[rewardId]) {
            ret = [LookupType.Quest, manualData.dragonridingItemToQuest[rewardId]];
        } else if (manualData.druidFormItemToQuest[rewardId]) {
            ret = [LookupType.Quest, manualData.druidFormItemToQuest[rewardId]];
        }
    }

    // Do this last as it includes Item
    if (ret[0] === LookupType.None && transmogTypes.has(rewardType)) {
        ret = [LookupType.Transmog, rewardId];
    }

    return ret;
}
