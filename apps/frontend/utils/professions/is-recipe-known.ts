import { derived } from 'svelte/store';

import { Faction } from '@/enums/faction';
import { settingsStore } from '@/shared/stores/settings';
import { staticStore } from '@/shared/stores/static';
import { itemStore, userStore } from '@/stores';
import type { Settings } from '@/shared/stores/settings/types';
import type { StaticData, StaticDataProfessionAbilityInfo } from '@/shared/stores/static/types';
import type { UserData } from '@/types';
import type { ItemData } from '@/types/data/item';

interface IsRecipeKnownStores {
    settings: Settings;
    itemData: ItemData;
    staticData: StaticData;
    userData: UserData;
}
interface IsRecipeKnownOptions {
    abilityInfo?: StaticDataProfessionAbilityInfo;
    itemId?: number;
}

export function isRecipeKnown(stores: IsRecipeKnownStores, options: IsRecipeKnownOptions) {
    let abilityInfo = options.abilityInfo;
    if (options.itemId) {
        abilityInfo = stores.staticData.professionAbilityByItemId[options.itemId];
    }

    if (!abilityInfo) {
        return false;
    }

    const collectorIds =
        stores.settings.professions.collectingCharactersV2?.[abilityInfo.professionId] || [];
    if (collectorIds.length > 0) {
        const primary = stores.userData.characterMap[collectorIds[0]];
        if (!primary) {
            return false;
        }

        if (primary.knowsProfessionAbility(abilityInfo.abilityId)) {
            return true;
        }

        // use backups if the primary collector can't learn the recipe
        const ability = stores.staticData.spellToProfessionAbility[abilityInfo.spellId];

        let recipeFaction: Faction = ability.faction;
        if (recipeFaction === Faction.Neutral) {
            let recipeAlliance = false;
            let recipeHorde = false;
            for (const itemId of abilityInfo.itemIds) {
                const item = stores.itemData.items[itemId];
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
        if (recipeFaction !== Faction.Neutral && recipeFaction !== primary.faction) {
            return collectorIds.slice(1).some((collectorId) => {
                const character = stores.userData.characterMap[collectorId];
                return (
                    character?.faction === recipeFaction &&
                    character.knowsProfessionAbility(abilityInfo.abilityId)
                );
            });
        }

        // TODO: different specialization
    } else {
        return stores.userData.hasRecipe.has(abilityInfo.abilityId);
    }

    return false;
}

export const isRecipeKnownDerived = derived(
    [settingsStore, itemStore, staticStore, userStore],
    ([$settingsStore, $itemStore, $staticStore, $userStore]) =>
        (options: IsRecipeKnownOptions) =>
            isRecipeKnown(
                {
                    settings: $settingsStore,
                    itemData: $itemStore,
                    staticData: $staticStore,
                    userData: $userStore,
                },
                options,
            ),
);
