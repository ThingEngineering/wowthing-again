import { fixedInventoryType } from './fixed-inventory-type';
import { transmogTypes } from '@/data/transmog';
import { RewardType } from '@/enums/reward-type';
import type { StaticData } from '@/shared/stores/static/types';
import type { LazyTransmog } from '@/stores/lazy/transmog';
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
    lazyTransmog: LazyTransmog,
    type: RewardType,
    id: number,
    appearanceIds?: number[],
    completionist?: boolean,
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
        } else if (itemData.teachesTransmog[id]) {
            const statsKey = `transmogSet:${itemData.teachesTransmog[id]}`;
            const stats = lazyTransmog.stats[statsKey];
            if (stats) {
                return stats.percent >= 100;
            }
        } else if (itemData.completesQuest[id]) {
            return accountTrackingQuest(itemData, userQuestData, id);
        }
    } else if (type === RewardType.AccountTrackingQuest) {
        return accountTrackingQuest(itemData, userQuestData, id);
    }

    if (transmogTypes.has(type)) {
        if (itemData.teachesTransmog[id]) {
            const statsKey = `transmogSet:${itemData.teachesTransmog[id]}`;
            const stats = lazyTransmog.stats[statsKey];
            if (stats) {
                return stats.percent >= 100;
            }
        }

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
            return Object.values(bySlot).every((hasSlot) => !!hasSlot);
        } else {
            const item = itemData.items[id];
            if (!item) {
                return false;
            }

            // If an item only has a single appearance, use that modifier. This is true
            // for things like Cosmetic items that teach specific difficulty appearances.
            const keys = Object.keys(item.appearances);
            const modifier = parseInt(keys.length === 1 ? keys[0] : '0');

            if (completionist) {
                return userData.hasSource.has(`${id}_${modifier}`);
            } else {
                const appearanceId = item.appearances?.[modifier]?.appearanceId || 0;
                return userData.hasAppearance.has(appearanceId);
            }
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
    return questIds.some(
        (questId) =>
            userQuestData.accountHas?.has(questId) ||
            Object.values(userQuestData.characters).some(
                (charData) => charData?.dailyQuests?.has(questId) || charData?.quests?.has(questId),
            ),
    );
}
