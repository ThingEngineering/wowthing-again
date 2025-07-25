import type { Faction } from '@/enums/faction';
import { settingsState } from '@/shared/state/settings.svelte';
import { lazyState } from '@/user-home/state/lazy';
import { userState } from '@/user-home/state/user';

// repeatedly accessing state is slow
export function snapshotStateForUserHasLookup() {
    return {
        anyCharacterHasQuestById: $state.snapshot(userState.quests.anyCharacterHasById),
        anyCharacterHasRecipeByAbilityId: $state.snapshot(userState.general.hasRecipe),
        anyCharacterKnowsSpellById: $state.snapshot(userState.general.anyCharacterKnowsSpellById),
        characterIdsByAbilityId: $state.snapshot(userState.general.characterIdsByAbilityId),
        collectingCharactersV2: $state.snapshot(
            settingsState.value.professions.collectingCharactersV2
        ),
        hasAppearanceById: $state.snapshot(userState.general.hasAppearanceById),
        hasAppearanceBySource: $state.snapshot(userState.general.hasAppearanceBySource),
        hasIllusionByEnchantmentId: $state.snapshot(userState.general.hasIllusionByEnchantmentId),
        hasMountById: $state.snapshot(userState.general.hasMountById),
        hasPetById: $state.snapshot(userState.general.hasPetById),
        hasToyByItemId: $state.snapshot(userState.general.hasToyByItemId),
        isKnownRecipeData: $state.snapshot(userState.general.isKnownRecipeData) as Record<
            number,
            [Faction, Set<number>]
        >,
        transmogStats: $state.snapshot(lazyState.transmog.stats),
    };
}
