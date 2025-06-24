import differenceWith from 'lodash/differenceWith';
import { DateTime } from 'luxon';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

import parseApiTime from '@/utils/parse-api-time';
import {
    UserQuestDataCharacterProgress,
    type UserQuestDataCharacterProgressArray,
} from '@/types/data';
import { timeState } from '@/shared/state/time.svelte';

export class CharacterQuests {
    public hasQuestById = new SvelteSet<number>();
    public progressQuestByKey = new SvelteMap<string, UserQuestDataCharacterProgress>();
    public scannedAt = $state<string>();
    public scannedTime = $state<DateTime>();

    constructor(public characterId: number) {}

    public process(
        scannedAt: string,
        questDiffs: number[],
        progressQuestArrayMap: Record<string, UserQuestDataCharacterProgressArray>
    ) {
        if (scannedAt === this.scannedAt) {
            return;
        }

        const currentTime = timeState.time.toUnixInteger();
        this.scannedAt = scannedAt;
        this.scannedTime = parseApiTime(scannedAt);

        const seenQuests = new Set<number>();
        let lastQuestId = 0;
        for (const questDiff of questDiffs || []) {
            const questId = lastQuestId + questDiff;
            this.hasQuestById.add(questId);
            seenQuests.add(questId);
            lastQuestId = questId;
        }

        for (const questId of this.hasQuestById.values()) {
            if (!seenQuests.has(questId)) {
                this.hasQuestById.delete(questId);
            }
        }

        const seenKeys = new Set<string>();
        for (const [key, progressQuestArray] of Object.entries(progressQuestArrayMap || {})) {
            // skip any quests that we know are expired
            const expires = progressQuestArray[2];
            if (expires > 0 && expires < currentTime) {
                continue;
            }

            seenKeys.add(key);

            const existingQuest = this.progressQuestByKey.get(key);
            const progressQuest = new UserQuestDataCharacterProgress(...progressQuestArray);
            if (!existingQuest) {
                this.progressQuestByKey.set(key, progressQuest);
            } else if (
                existingQuest.expires !== progressQuest.expires ||
                existingQuest.status !== progressQuest.status ||
                existingQuest.objectives.length !== progressQuest.objectives.length ||
                differenceWith(
                    existingQuest.objectives,
                    progressQuest.objectives,
                    (first, second) =>
                        first.have !== second.have ||
                        first.need !== second.need ||
                        first.text !== second.text ||
                        first.type !== second.type
                ).length > 0
            ) {
                this.progressQuestByKey.set(key, progressQuest);
            }
        }

        for (const key of this.progressQuestByKey.keys()) {
            if (!seenKeys.has(key)) {
                this.progressQuestByKey.delete(key);
            }
        }
    }
}
