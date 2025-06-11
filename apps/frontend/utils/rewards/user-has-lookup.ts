import { LookupType } from '@/enums/lookup-type';
import { wowthingData } from '@/shared/stores/data';
import { lazyState } from '@/user-home/state/lazy';
import type { Settings } from '@/shared/stores/settings/types/settings';
import type { UserQuestData } from '@/types/data';
import type { UserData } from '@/types/user-data';

import { fixedInventoryType } from '../fixed-inventory-type';
import { isRecipeKnown } from '../professions/is-recipe-known';

export function userHasLookup(
    settings: Settings,
    userData: UserData,
    userQuestData: UserQuestData,
    type: LookupType,
    id: number,
    {
        appearanceIds,
        completionist,
        modifier,
    }: {
        appearanceIds?: number[];
        completionist?: boolean;
        modifier?: number;
    }
): boolean {
    if (type === LookupType.Illusion) {
        return userData.hasIllusion.has(appearanceIds[0]);
    } else if (type === LookupType.Mount) {
        return !!userData.hasMount?.[id];
    } else if (type === LookupType.Pet) {
        return !!userData.hasPet?.[id];
    } else if (type === LookupType.Toy) {
        return !!userData.hasToy?.[id];
    } else if (type === LookupType.Recipe) {
        const abilityInfo = wowthingData.static.professionAbilityByAbilityId.get(id);
        return isRecipeKnown({ abilityInfo });
    } else if (type === LookupType.Quest) {
        return accountTrackingQuest(userQuestData, [id]);
    } else if (type === LookupType.Spell) {
        return userData.characters.some((char) => char.knownSpells?.includes(id));
    } else if (type === LookupType.TransmogSet) {
        const statsKey = `ensemble:${id}`;
        const stats = lazyState.transmog.stats[statsKey];
        return stats?.percent >= 100;
    } else if (type === LookupType.Transmog) {
        if (appearanceIds?.[0] > 0) {
            const bySlot: Record<number, boolean> = {};
            for (const appearanceId of appearanceIds) {
                const appearanceItemsAndModifiers =
                    wowthingData.items.appearanceToItems[appearanceId];
                for (const [itemId] of appearanceItemsAndModifiers) {
                    const appearanceItem = wowthingData.items.items[itemId];
                    const invType = fixedInventoryType(appearanceItem.inventoryType);
                    bySlot[invType] ||= userData.hasAppearance.has(appearanceId);
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
            const keys = Object.keys(item.appearances).map((n) => parseInt(n));
            let itemModifier = 0;
            if (modifier !== undefined && keys.includes(modifier)) {
                itemModifier = modifier;
            } else if (keys.length === 1) {
                itemModifier = keys[0];
            }

            if (completionist) {
                return userData.hasSourceV2.get(itemModifier).has(id);
            } else {
                const appearanceId = item.appearances?.[itemModifier]?.appearanceId || 0;
                return userData.hasAppearance.has(appearanceId);
            }
        }
    }

    return false;
}

function accountTrackingQuest(userQuestData: UserQuestData, questIds: number[]): boolean {
    return questIds.some(
        (questId) =>
            userQuestData.accountHas?.has(questId) ||
            Object.values(userQuestData.characters).some(
                (charData) => charData?.dailyQuests?.has(questId) || charData?.quests?.has(questId)
            )
    );
}
