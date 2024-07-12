import { fixedInventoryType } from '../fixed-inventory-type';
import { LookupType } from '@/enums/lookup-type';
import type { Settings } from '@/shared/stores/settings/types/settings';
import type { StaticData } from '@/shared/stores/static/types';
import type { LazyTransmog } from '@/stores/lazy/transmog';
import type { UserQuestData } from '@/types/data';
import type { ItemData } from '@/types/data/item';
import type { UserData } from '@/types/user-data';

export function userHasLookup(
    settings: Settings,
    itemData: ItemData,
    staticData: StaticData,
    userData: UserData,
    userQuestData: UserQuestData,
    lazyTransmog: LazyTransmog,
    type: LookupType,
    id: number,
    appearanceIds?: number[],
    completionist?: boolean,
): boolean {
    if (type === LookupType.Illusion) {
        return userData.hasIllusion.has(appearanceIds[0]);
    } else if (type === LookupType.Mount) {
        return !!userData.hasMount[id];
    } else if (type === LookupType.Pet) {
        return !!userData.hasPet[id];
    } else if (type === LookupType.Toy) {
        return !!userData.hasToy[id];
    } else if (type === LookupType.ProfessionAbility) {
        const ability = staticData.professionAbilityByAbilityId[id];
        const characterId = settings.professions.collectingCharacters?.[ability.professionId];
        if (characterId) {
            return userData.characterMap[characterId]?.knowsProfessionAbility(ability.abilityId);
        } else {
            return userData.characters.some((char) =>
                char?.knowsProfessionAbility(ability.abilityId),
            );
        }
    } else if (type === LookupType.Quest) {
        return accountTrackingQuest(itemData, userQuestData, id);
    } else if (type === LookupType.TransmogSet) {
        const statsKey = `transmogSet:${id}`;
        const stats = lazyTransmog.stats[statsKey];
        return stats?.percent >= 100;
    } else if (type === LookupType.Transmog) {
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
