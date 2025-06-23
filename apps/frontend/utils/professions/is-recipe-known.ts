import { Faction } from '@/enums/faction';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { userState } from '@/user-home/state/user';
import type { StaticDataProfessionAbilityInfo } from '@/shared/stores/static/types';

interface IsRecipeKnownOptions {
    abilityInfo?: StaticDataProfessionAbilityInfo;
    itemId?: number;
}

export function isRecipeKnown(
    options: IsRecipeKnownOptions,
    characterIdsByAbilityId: Record<number, number[]> = null,
    collectingCharactersV2: Record<number, number[]> = null,
    isKnownRecipeData: Record<number, [Faction, Set<number>]> = null
) {
    let abilityInfo = options.abilityInfo;
    if (options.itemId) {
        abilityInfo = wowthingData.static.professionAbilityByItemId.get(options.itemId);
    }

    if (!abilityInfo) {
        return false;
    }

    characterIdsByAbilityId ||= userState.general.characterIdsByAbilityId;
    collectingCharactersV2 ||= settingsState.value.professions.collectingCharactersV2;
    isKnownRecipeData ||= userState.general.isKnownRecipeData;

    const collectorIds = collectingCharactersV2?.[abilityInfo.professionId] || [];
    if (collectorIds.length > 0) {
        const primary = isKnownRecipeData[collectorIds[0]];
        if (!primary) {
            return false;
        }

        if (primary[1].has(abilityInfo.abilityId)) {
            return true;
        }

        // use backups if the primary collector can't learn the recipe
        let recipeFaction: Faction = abilityInfo.ability.faction;
        if (recipeFaction === Faction.Neutral) {
            let recipeAlliance = false;
            let recipeHorde = false;
            for (const itemId of abilityInfo.itemIds) {
                const item = wowthingData.items.items[itemId];
                if (item?.allianceOnly) {
                    recipeAlliance = true;
                } else if (item?.hordeOnly) {
                    recipeHorde = true;
                }
            }

            if (recipeAlliance && !recipeHorde) {
                recipeFaction = Faction.Alliance;
            } else if (recipeHorde && !recipeAlliance) {
                recipeFaction = Faction.Horde;
            }
        }

        // different faction
        if (recipeFaction !== Faction.Neutral && recipeFaction !== primary[0]) {
            return collectorIds.slice(1).some((collectorId) => {
                const collectorData = isKnownRecipeData[collectorId];
                return (
                    collectorData?.[0] === recipeFaction &&
                    collectorData?.[1].has(abilityInfo.abilityId)
                );
            });
        }

        // TODO: different specialization
    } else {
        return !!characterIdsByAbilityId[abilityInfo.abilityId];
    }

    return false;
}
