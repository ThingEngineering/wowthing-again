import { SvelteMap, SvelteSet } from 'svelte/reactivity';

import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { UserQuestData } from '@/types/data/user-quest';

import { CharacterQuests } from './types';

export class DataUserQuests {
    public accountHasById = new SvelteSet<number>();
    public characterById = new SvelteMap<number, CharacterQuests>();

    public process(userQuestData: UserQuestData): void {
        console.time('DataUserQuests.process');

        for (const questId of userQuestData.account || []) {
            this.accountHasById.add(questId);
        }

        for (const [characterId, characterData] of getNumberKeyedEntries(
            userQuestData.characters
        )) {
            let characterQuests = this.characterById.get(characterId);
            if (!characterQuests) {
                characterQuests = new CharacterQuests(characterId);
                this.characterById.set(characterId, characterQuests);
            }
            characterQuests.process(
                characterData.scannedAt,
                characterData.questList,
                characterData.rawProgressQuests
            );
        }

        console.timeEnd('DataUserQuests.process');
    }
}
