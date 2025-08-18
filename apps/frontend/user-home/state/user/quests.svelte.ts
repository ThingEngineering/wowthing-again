import { SvelteSet } from 'svelte/reactivity';

import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { UserQuestData } from '@/types/data/user-quest';

import { CharacterQuests } from './types';

export class DataUserQuests {
    public accountHasById = new SvelteSet<number>();
    // public characterById = new SvelteMap<number, CharacterQuests>();
    public characterById = new Map<number, CharacterQuests>();

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
                characterData.goldWorldQuests,
                characterData.rawProgressQuests
            );
        }

        console.timeEnd('DataUserQuests.process');
    }

    public anyCharacterHasById = $derived.by(() => {
        const ret = new Set<number>();
        for (const character of this.characterById.values()) {
            for (const questId of character.hasQuestById.values()) {
                ret.add(questId);
            }
        }
        return ret;
    });

    public progressQuestCharactersByKey = $derived.by(() => {
        const ret: Record<string, number[]> = {};

        for (const character of this.characterById.values()) {
            for (const key of character.progressQuestByKey?.keys() || []) {
                (ret[key] ||= []).push(character.characterId);
            }
        }

        return ret;
    });
}
