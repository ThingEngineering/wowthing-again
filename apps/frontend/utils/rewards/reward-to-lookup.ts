import { transmogTypes } from '@/data/transmog';
import { LookupType } from '@/enums/lookup-type';
import { RewardType } from '@/enums/reward-type';
import { wowthingData } from '@/shared/stores/data';

const rewardLookupMap: Record<number, LookupType> = {
    [RewardType.AccountQuest]: LookupType.Quest,
    [RewardType.Illusion]: LookupType.Illusion,
    [RewardType.Mount]: LookupType.Mount,
    [RewardType.Pet]: LookupType.Pet,
    [RewardType.Toy]: LookupType.Toy,
};

export function rewardToLookup(
    rewardType: RewardType,
    rewardId: number,
    trackingQuestId?: number
): [LookupType, number] {
    const manualData = wowthingData.manual;
    let ret: [LookupType, number] = [LookupType.None, 0];

    if (rewardLookupMap[rewardType]) {
        ret = [rewardLookupMap[rewardType], rewardId];
    } else if (rewardType === RewardType.Item) {
        if (wowthingData.static.mountByItemId.has(rewardId)) {
            ret = [LookupType.Mount, wowthingData.static.mountByItemId.get(rewardId).id];
        } else if (wowthingData.static.petByItemId.has(rewardId)) {
            ret = [LookupType.Pet, wowthingData.static.petByItemId.get(rewardId).id];
        } else if (wowthingData.static.toyByItemId.has(rewardId)) {
            ret = [LookupType.Toy, rewardId];
        } else if (wowthingData.items.teachesTransmog[rewardId]) {
            ret = [LookupType.TransmogSet, wowthingData.items.teachesTransmog[rewardId]];
            // FIXME
            // } else if (staticData.professionAbilityByItemId[rewardId]) {
            //     const ability = staticData.professionAbilityByItemId[rewardId];
            //     ret = [LookupType.Recipe, ability.abilityId];
        } else if (manualData.dragonridingItemToQuest.has(rewardId)) {
            ret = [LookupType.Quest, manualData.dragonridingItemToQuest.get(rewardId)];
        } else if (manualData.druidFormItemToQuest.has(rewardId)) {
            ret = [LookupType.Quest, manualData.druidFormItemToQuest.get(rewardId)];
        } else if (wowthingData.items.completesQuest[rewardId]) {
            // this should always be the last Quest return type, several other kinds of item
            // are also included in this lookup table
            ret = [LookupType.Quest, wowthingData.items.completesQuest[rewardId][0]];
        } else if (trackingQuestId > 0) {
            ret = [LookupType.Quest, trackingQuestId];
        } else if (wowthingData.items.teachesSpell[rewardId]) {
            ret = [LookupType.Spell, wowthingData.items.teachesSpell[rewardId][0]];
        }
    }

    // Do this last as it includes Item
    if (ret[0] === LookupType.None && transmogTypes.has(rewardType)) {
        ret = [LookupType.Transmog, rewardId];
    }

    return ret;
}
