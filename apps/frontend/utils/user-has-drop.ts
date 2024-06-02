import every from 'lodash/every';
import some from 'lodash/some';

import { fixedInventoryType } from './fixed-inventory-type';
import { transmogTypes } from '@/data/transmog';
import { InventoryType } from '@/enums/inventory-type';
import { RewardType } from '@/enums/reward-type';
import type { StaticData } from '@/shared/stores/static/types';
import type { UserQuestData } from '@/types/data';
import type { ItemData } from '@/types/data/item';
import type { ManualData } from '@/types/data/manual';
import type { UserData } from '@/types/user-data';

export default function userHasDrop(
    itemData: ItemData,
    manualData: ManualData,
    staticData: StaticData,
    userData: UserData,
    userQuestData: UserQuestData,
    type: RewardType,
    id: number,
    appearanceIds?: number[],
): boolean {
    if (
        (type === RewardType.Mount && userData.hasMount[id] === true) ||
        (type === RewardType.Pet && userData.hasPet[id] === true) ||
        (type === RewardType.Toy && userData.hasToy[id] === true) ||
        (type === RewardType.Illusion && userData.hasIllusion.has(appearanceIds[0]))
    ) {
        return true;
    } else if (type === RewardType.Item) {
        if (manualData.dragonridingItemToQuest[id]) {
            return userQuestData.accountHas.has(manualData.dragonridingItemToQuest[id]);
        } else if (manualData.druidFormItemToQuest[id]) {
            return userQuestData.accountHas.has(manualData.druidFormItemToQuest[id]);
        } else if (staticData.mountsByItem[id]) {
            return userData.hasMount[staticData.mountsByItem[id].id] === true;
        } else if (staticData.toys[id]) {
            return userData.hasToy[id] === true;
        } else if (itemData.completesQuest[id]) {
            return accountTrackingQuest(itemData, userQuestData, id);
        }
    } else if (type === RewardType.AccountTrackingQuest) {
        return accountTrackingQuest(itemData, userQuestData, id);
    } else if (transmogTypes.has(type)) {
        if (appearanceIds?.[0] > 0) {
            const bySlot: Record<number, boolean> = {};
            for (const appearanceId of appearanceIds) {
                const appearanceItemsAndModifiers = itemData.appearanceToItems[appearanceId];
                for (const [itemId] of appearanceItemsAndModifiers) {
                    const appearanceItem = itemData.items[itemId];
                    const invType = fixedInventoryType(appearanceItem.inventoryType);
                    bySlot[invType] ||= userData.hasAppearance.has(appearanceId);
                }
            }
            return every(Object.values(bySlot), (hasSlot) => !!hasSlot);
        } else {
            const appearanceId = itemData.items[id]?.appearances?.[0]?.appearanceId || 0;
            return userData.hasAppearance.has(appearanceId);
        }
    }

    return false;
}

function accountTrackingQuest(
    itemData: ItemData,
    userQuestData: UserQuestData,
    id: number,
): boolean {
    const questIds = itemData.completesQuest[id] || [];
    return some(
        questIds,
        (questId) =>
            userQuestData.accountHas?.has(questId) ||
            some(
                Object.values(userQuestData.characters),
                (charData) => charData?.dailyQuests?.has(questId) || charData?.quests?.has(questId),
            ),
    );
}
