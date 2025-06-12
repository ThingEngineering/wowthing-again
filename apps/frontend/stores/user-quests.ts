import sortBy from 'lodash/sortBy';
import { get } from 'svelte/store';
import type { DateTime } from 'luxon';

import { userModifiedStore } from './user-modified';
import { WritableFancyStore } from '@/types/fancy-store';
import { UserQuestDataCharacterProgress, type UserQuestData } from '@/types/data';
import parseApiTime from '@/utils/parse-api-time';
import { userState } from '@/user-home/state/user';

export class UserQuestDataStore extends WritableFancyStore<UserQuestData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user');
        if (url) {
            const modified = get(userModifiedStore).quests;
            url = url.replace(/\/(?:public|private).+$/, `/quests-${modified}.json`);
        }
        return url;
    }

    initialize(userQuestData: UserQuestData): void {
        console.time('UserQuestDataStore.initialize');

        userState.quests.process(userQuestData);

        if (userQuestData.accountHas === undefined) {
            userQuestData.accountHas = new Set<number>(userQuestData.account || []);
            userQuestData.account = null;
        }

        userQuestData.questNames = {};
        for (const [, characterData] of Object.entries(userQuestData.characters)) {
            if (characterData.scannedAt) {
                characterData.scannedTime = parseApiTime(characterData.scannedAt);
            }

            if (characterData.dailyQuestList) {
                characterData.dailyQuests = new Set<number>(characterData.dailyQuestList);
                characterData.dailyQuestList = null;
            }

            if (characterData.questList) {
                characterData.quests = new Set<number>();
                let lastQuestId = 0;
                for (const questIdDiff of characterData.questList) {
                    const questId = questIdDiff + lastQuestId;
                    characterData.quests.add(questId);
                    lastQuestId = questId;
                }
                characterData.questList = null;
            }

            characterData.progressQuests ||= {};
            if (characterData.rawProgressQuests) {
                for (const [questKey, questArray] of Object.entries(
                    characterData.rawProgressQuests
                )) {
                    characterData.progressQuests[questKey] = new UserQuestDataCharacterProgress(
                        ...questArray
                    );
                }

                characterData.rawProgressQuests = null;
            }

            for (const [key, progressQuest] of Object.entries(characterData.progressQuests || {})) {
                userQuestData.questNames[key] ||= progressQuest.name;
            }
        }

        console.timeEnd('UserQuestDataStore.initialize');
    }

    setup(currentTime: DateTime) {
        const now = currentTime.toUnixInteger();
        for (const characterData of Object.values(this.value.characters)) {
            // Discard any expired quests
            for (const [key, progressQuest] of Object.entries(characterData.progressQuests || {})) {
                if (progressQuest.expires > 0 && progressQuest.expires < now) {
                    delete characterData.progressQuests[key];
                }
            }
        }
    }

    latestHas(questId: number): boolean {
        return sortBy(this.value.characters, (char) => -char.scannedTime)[0]?.quests?.has(questId);
    }

    characterHas(characterId: number, questId: number): boolean {
        const charData = this.value.characters[characterId];
        return charData?.dailyQuests?.has(questId) || charData?.quests?.has(questId);
    }

    hasAny(characterId: number, questId: number): boolean {
        return this.characterHas(characterId, questId) || this.value.accountHas.has(questId);
    }
}

export const userQuestStore = new UserQuestDataStore();
