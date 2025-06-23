import { LookupType } from '@/enums/lookup-type';
import { wowthingData } from '@/shared/stores/data';
import { fixedInventoryType } from '@/utils/fixed-inventory-type';
import { isRecipeKnown } from '@/utils/professions/is-recipe-known';

import { snapshotStateForUserHasLookup } from './snapshot-state-for-user-has-lookup.svelte';

export function userHasLookup(
    snapshot: ReturnType<typeof snapshotStateForUserHasLookup>,
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
        return snapshot.hasIllusionByEnchantmentId.has(appearanceIds[0]);
    } else if (type === LookupType.Mount) {
        return snapshot.hasMountById.has(id);
    } else if (type === LookupType.Pet) {
        return snapshot.hasPetById.has(id);
    } else if (type === LookupType.Toy) {
        return snapshot.hasToyByItemId.has(id);
    } else if (type === LookupType.Recipe) {
        const abilityInfo = wowthingData.static.professionAbilityByAbilityId.get(id);
        return isRecipeKnown(
            { abilityInfo },
            snapshot.characterIdsByAbilityId,
            snapshot.collectingCharactersV2,
            snapshot.isKnownRecipeData
        );
    } else if (type === LookupType.Quest) {
        return snapshot.anyCharacterHasQuestById.has(id);
    } else if (type === LookupType.Spell) {
        return snapshot.anyCharacterKnowsSpellById.has(id);
    } else if (type === LookupType.TransmogSet) {
        const statsKey = `ensemble:${id}`;
        const stats = snapshot.transmogStats[statsKey];
        // snapshot state has no prototype and .percent is a getter
        return (stats?.have || 0) >= (stats?.total || 1);
    } else if (type === LookupType.Transmog) {
        if (appearanceIds?.[0] > 0) {
            const bySlot: Record<number, boolean> = {};
            for (const appearanceId of appearanceIds) {
                const appearanceItemsAndModifiers =
                    wowthingData.items.appearanceToItems[appearanceId];
                for (const [itemId] of appearanceItemsAndModifiers) {
                    const appearanceItem = wowthingData.items.items[itemId];
                    const invType = fixedInventoryType(appearanceItem.inventoryType);
                    bySlot[invType] ||= snapshot.hasAppearanceById.has(appearanceId);
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
                return snapshot.hasAppearanceBySource.has(id * 1000 + itemModifier);
            } else {
                const appearanceId = item.appearances?.[itemModifier]?.appearanceId || 0;
                return snapshot.hasAppearanceById.has(appearanceId);
            }
        }
    }

    return false;
}
