import { Constants } from '@/data/constants';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import type { StaticDataProfession } from '@/shared/stores/static/types';
import type { Character, CharacterProfession } from '@/types';

export type ProfessionData = [StaticDataProfession, CharacterProfession, boolean];

export function getCharacterProfessions(
    character: Character,
    professionType: number
): ProfessionData[] {
    const professions: ProfessionData[] = [];

    for (const profession of wowthingData.static.professionById.values()) {
        if (profession?.type === professionType) {
            if (profession.subProfessions.length > 0) {
                let found = false;
                for (const expansion of settingsState.expansions) {
                    const subProfession = profession.expansionSubProfession[expansion.id];
                    const characterSubProfession =
                        character.professions?.[profession.id]?.[subProfession.id];
                    if (characterSubProfession) {
                        professions.push([
                            profession,
                            characterSubProfession,
                            expansion.id === Constants.expansion,
                        ]);
                        found = true;
                        break;
                    }
                }

                if (!found && professionType === 1) {
                    professions.push([profession, null, true]);
                }
            } else {
                const characterProfession = character.professions?.[profession.id]?.[profession.id];
                professions.push([profession, characterProfession || null, true]);
            }
        }
    }

    professions.sort((a, b) => a[0].name.localeCompare(b[0].name));
    return professions;
}
