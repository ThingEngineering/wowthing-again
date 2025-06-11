import { transmogTypes } from '@/data/transmog';
import { RewardType } from '@/enums/reward-type';
import { wowthingData } from '@/shared/stores/data';
import { lazyState } from '@/user-home/state/lazy';
import { userState } from '@/user-home/state/user';
import type { Settings } from '@/shared/stores/settings/types/settings';

import { fixedInventoryType } from './fixed-inventory-type';
import { isRecipeKnown } from './professions/is-recipe-known';

export default function userHasDrop(
    settings: Settings,
    type: RewardType,
    id: number,
    appearanceIds?: number[],
    completionist?: boolean
): boolean {
    const manualData = wowthingData.manual;

    if (
        (type === RewardType.Mount && userState.general.hasMountById.has(id)) ||
        (type === RewardType.Pet && userState.general.hasPetById.has(id)) ||
        (type === RewardType.Toy && userState.general.hasToyById.has(id)) ||
        (type === RewardType.Illusion &&
            userState.general.hasIllusionByEnchantmentId.has(appearanceIds[0]))
    ) {
        return true;
    } else if (type === RewardType.Item) {
        if (manualData.dragonridingItemToQuest.has(id)) {
            return userState.quests.accountHasById.has(manualData.dragonridingItemToQuest.get(id));
        } else if (manualData.druidFormItemToQuest.has(id)) {
            return userState.quests.accountHasById.has(manualData.druidFormItemToQuest.get(id));
            return false;
        } else if (wowthingData.static.mountByItemId.has(id)) {
            return userState.general.hasMountById.has(wowthingData.static.mountByItemId.get(id).id);
        } else if (wowthingData.static.petByItemId.has(id)) {
            return userState.general.hasPetById.has(wowthingData.static.petByItemId.get(id).id);
        } else if (wowthingData.static.toyByItemId.has(id)) {
            return userState.general.hasToyByItemId.has(id);
        } else if (wowthingData.items.teachesTransmog[id]) {
            const statsKey = `ensemble:${wowthingData.items.teachesTransmog[id]}`;
            const stats = lazyState.transmog.stats[statsKey];
            if (stats) {
                return stats.percent >= 100;
            }
        } else if (wowthingData.items.completesQuest[id]) {
            return accountTrackingQuest(id);
        } else if (wowthingData.static.professionAbilityByItemId.has(id)) {
            const abilityInfo = wowthingData.static.professionAbilityByItemId.get(id);
            return isRecipeKnown({ abilityInfo });
        }
    } else if (type === RewardType.AccountQuest) {
        return accountTrackingQuest(id);
    }

    if (transmogTypes.has(type)) {
        if (wowthingData.items.teachesTransmog[id]) {
            const statsKey = `ensemble:${wowthingData.items.teachesTransmog[id]}`;
            const stats = lazyState.transmog.stats[statsKey];
            if (stats) {
                return stats.percent >= 100;
            }
        }

        if (appearanceIds?.[0] > 0) {
            const bySlot: Record<number, boolean> = {};
            for (const appearanceId of appearanceIds) {
                const appearanceItemsAndModifiers =
                    wowthingData.items.appearanceToItems[appearanceId];
                for (const [itemId] of appearanceItemsAndModifiers) {
                    const appearanceItem = wowthingData.items.items[itemId];
                    const invType = fixedInventoryType(appearanceItem.inventoryType);
                    bySlot[invType] ||= userState.general.hasAppearanceById.has(appearanceId);
                }
            }
            return Object.values(bySlot).every((hasSlot) => !!hasSlot);
        } else {
            const item = wowthingData.items.items[id];
            if (!item) {
                return false;
            }

            // If an item only has a single appearance, use that modifier. This is true
            // for things like Cosmetic items that teach specific difficulty appearances.
            const keys = Object.keys(item.appearances);
            const modifier = parseInt(keys.length === 1 ? keys[0] : '0');

            if (completionist) {
                return userState.general.hasAppearanceBySource.has(id * 1000 + modifier);
            } else {
                const appearanceId = item.appearances?.[modifier]?.appearanceId || 0;
                return userState.general.hasAppearanceById.has(appearanceId);
            }
        }
    }

    return false;
}

function accountTrackingQuest(id: number): boolean {
    const questIds = wowthingData.items.completesQuest[id] || [];
    return questIds.some(
        (questId) =>
            userState.quests.accountHasById.has(questId) ||
            Array.from(userState.quests.characterById.values()).some((charData) =>
                charData.hasQuestById.has(questId)
            )
    );
}
