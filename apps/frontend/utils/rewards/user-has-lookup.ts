import { LookupType } from '@/enums/lookup-type';
import { wowthingData } from '@/shared/stores/data';
import { lazyState } from '@/user-home/state/lazy';
import { userState } from '@/user-home/state/user';
import { fixedInventoryType } from '@/utils/fixed-inventory-type';
import { isRecipeKnown } from '@/utils/professions/is-recipe-known';

export function userHasLookup(
    hasAppearanceById: Set<number>,
    hasAppearanceBySource: Set<number>,
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
        return userState.general.hasIllusionByEnchantmentId.has(appearanceIds[0]);
    } else if (type === LookupType.Mount) {
        return userState.general.hasMountById.has(id);
    } else if (type === LookupType.Pet) {
        return userState.general.hasPetById.has(id);
    } else if (type === LookupType.Toy) {
        return userState.general.hasToyByItemId.has(id);
    } else if (type === LookupType.Recipe) {
        const abilityInfo = wowthingData.static.professionAbilityByAbilityId.get(id);
        return isRecipeKnown({ abilityInfo });
    } else if (type === LookupType.Quest) {
        return accountTrackingQuest([id]);
    } else if (type === LookupType.Spell) {
        return userState.general.characters.some((char) => char.knownSpells?.includes(id));
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
                    bySlot[invType] ||= hasAppearanceById.has(appearanceId);
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
                return hasAppearanceBySource.has(id * 1000 + itemModifier);
            } else {
                const appearanceId = item.appearances?.[itemModifier]?.appearanceId || 0;
                return hasAppearanceById.has(appearanceId);
            }
        }
    }

    return false;
}

function accountTrackingQuest(questIds: number[]): boolean {
    return questIds.some(
        (questId) =>
            userState.quests.accountHasById.has(questId) ||
            Array.from(userState.quests.characterById.values()).some((charData) =>
                charData.hasQuestById.has(questId)
            )
    );
}
